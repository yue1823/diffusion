module all_or_nothing::liquidity {

    use std::bcs;
    use std::error;
    use std::option;

    use std::signer::address_of;
    use std::string;
    use std::string::{String, utf8};
    use std::vector;
    use aptos_std::comparator;
    use aptos_std::from_bcs::to_u64;
    use aptos_std::math128;
    use aptos_std::math64;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_std::smart_vector;
    use aptos_std::smart_vector::SmartVector;
    use aptos_framework::coin;
    use aptos_framework::coin::paired_metadata;
    use aptos_framework::dispatchable_fungible_asset;

    use aptos_framework::event;
    use aptos_framework::event::emit;
    use aptos_framework::fungible_asset;
    use aptos_framework::fungible_asset::{FungibleStore, MintRef, BurnRef, Metadata, generate_mint_ref,
        generate_burn_ref, generate_transfer_ref,TransferRef,FungibleAsset, store_metadata
    };
    use aptos_framework::object;
    use aptos_framework::object::{ ExtendRef, DeleteRef, Object, ConstructorRef, object_address, create_named_object,
        generate_signer, generate_extend_ref
    };
    use aptos_framework::primary_fungible_store;
    use aptos_framework::transaction_context::function_name;
    use all_or_nothing::deploy_token;
    use all_or_nothing::package_manager::get_limit_signer;
    use all_or_nothing::limit;
    use all_or_nothing::list;

    use all_or_nothing::package_manager;

    friend all_or_nothing::uma;

    const Seed :vector<u8> = b"all or nothing";
    const Limit_seed:vector <u8> =b"Limit seed";
    const LP_TOKEN_DECIMALS:u8 =8;
    const FEE_SCALE: u64 = 10000;
    const MINIMUM_LIQUIDITY: u64 = 1000;

    /// Swap leaves pool in a worse state than before.
    const EK_BEFORE_SWAP_GREATER_THAN_EK_AFTER_SWAP: u64 = 8;
    /// Not admin
    const E_not_admin:u64 =2;
    /// NO pair metadata
    const E_no_pair_metadata:u64 = 3;
    ///Empty box
    const E_empty_box:u64 =4;
    /// Amount of tokens provided must be greater than zero.
    const EZERO_AMOUNT: u64 = 5;
    /// The amount of liquidity provided is so small that corresponding LP token amount is rounded to zero.
    const EINSUFFICIENT_LIQUIDITY_MINTED: u64 = 6;

    /// The liquidity pool is misconfigured and has 0 amount of one asset but non-zero amount of the other.
    const EINFINITY_POOL: u64 = 7;
    /// Output is less than the desired minimum amount.
    const EINSUFFICIENT_OUTPUT_AMOUNT: u64 = 8;
    /// One or both tokens passed are not valid native fungible assets.
    const ENOT_NATIVE_FUNGIBLE_ASSETS: u64 = 9;

    #[event]
    /// Event emitted when a pool is created.
    struct CreatePool has drop, store {
        pool: Object<Pool>,
        token_1: Object<Metadata>,
        token_2: Object<Metadata>,
    }
    #[event]
    struct SwapEvent has drop,store {
        pool: Object<Pool>,
        from_token: Object<Metadata>,
        amount_in: u64,
        amount_out:u64,
        fee_charge:u64
    }
    struct Cap_control has key,store{
        ext:ExtendRef
    }

    struct LPref has key,store {
        mint_ref:MintRef,
        burn_ref:BurnRef,
        tran_ref:TransferRef
    }
    struct LiquidityPoolConfigs has key {
        all_pools: SmartVector<Object<Pool>>,
        is_paused: bool,
        fee_manager: address,
        pauser: address,
        pending_fee_manager: address,
        pending_pauser: address,
        stable_fee_bps: u64,
        volatile_fee_bps: u64,
    }


    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Pool has key ,store {
        x_coin:Object<FungibleStore>,
        y_coin:Object<FungibleStore>,
        lp_ref:LPref,
        fee_1:u64,
        init_price:u64,
        init_size_x:u64,
        init_size_y:u64,
        period:u64
    }
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct FeesAccounting has key {
        total_fees_1: u128,
        total_fees_2: u128,
        total_fees_at_last_claim_1: SmartTable<address, u128>,
        total_fees_at_last_claim_2: SmartTable<address, u128>,
        claimable_1: SmartTable<address, u128>,
        claimable_2: SmartTable<address, u128>,
    }

    #[view]
    public fun is_sorted(token_1: Object<Metadata>, token_2: Object<Metadata>): bool {
        let token_1_addr = object::object_address(&token_1);
        let token_2_addr = object::object_address(&token_2);
        comparator::is_smaller_than(&comparator::compare(&token_1_addr, &token_2_addr))
    }
    #[view]
    public fun liquidity_pool_address(
        token_1: Object<Metadata>,
        token_2: Object<Metadata>,

    ): address {
        if (!is_sorted(token_1, token_2)) {
            return liquidity_pool_address(token_2, token_1)
        };
        object::create_object_address(&address_of(&package_manager::get_signer()), get_pool_seeds(token_1, token_2))
    }

    #[view]
    public fun liquidity_pool(
        token_1: Object<Metadata>,
        token_2: Object<Metadata>,
    ): Object<Pool> {
        object::address_to_object(liquidity_pool_address(token_1, token_2))
    }
    #[view]
    public fun reverse(pool: Object<Pool>) :(u256,u256)acquires Pool {
        let pool_data = borrow_global<Pool>(object_address(&pool));
        let reserve_1 = (fungible_asset::balance(pool_data.x_coin) as u256);
        let reserve_2 = (fungible_asset::balance(pool_data.y_coin) as u256);
        (reserve_1,reserve_2)
    }
    #[view]
    /// Return the amount of tokens received for a swap with the given amount in and the liquidity pool.
    public fun get_amount_out(
        pool: Object<Pool>,
        from: Object<Metadata>,
        amount_in: u64,
    ): (u64, u64) acquires Pool {
        let pool_data = borrow_global<Pool>(object_address(&pool));
        let reserve_1 = (fungible_asset::balance(pool_data.x_coin) as u256);
        let reserve_2 = (fungible_asset::balance(pool_data.y_coin) as u256);
        let (reserve_in, reserve_out) = if (from == fungible_asset::store_metadata(pool_data.x_coin)) {
            (reserve_1, reserve_2)
        } else {
            (reserve_2, reserve_1)
        };
        let fees_amount = math64::mul_div(amount_in, pool_data.fee_1, FEE_SCALE);
        let amount_in = ((amount_in - fees_amount) as u256);
        let amount_out = amount_in * reserve_out / (reserve_in + amount_in);

        ((amount_out as u64), fees_amount)
    }
    inline fun lp_token_name(token_1: Object<Metadata>, token_2: Object<Metadata>): String {
        let token_symbol = string::utf8(b"LP-");
        string::append(&mut token_symbol, fungible_asset::symbol(token_1));
        string::append_utf8(&mut token_symbol, b"-");
        string::append(&mut token_symbol, fungible_asset::symbol(token_2));
        token_symbol
    }

    inline fun get_pool_seeds(token_1: Object<Metadata>, token_2: Object<Metadata>): vector<u8> {
        let seeds = vector[];
        vector::append(&mut seeds, bcs::to_bytes(&object::object_address(&token_1)));
        vector::append(&mut seeds, bcs::to_bytes(&object::object_address(&token_2)));
        seeds
    }
    inline fun create_lp_token(
        token_1: Object<Metadata>,
        token_2: Object<Metadata>,
    ): &ConstructorRef {
        let token_name = lp_token_name(token_1, token_2);
        let seeds = get_pool_seeds(token_1, token_2);
        let lp_token_constructor_ref = &object::create_named_object(&package_manager::get_signer(), seeds);
        // We don't enable automatic primary store creation because we need LPs to call into this module for transfers
        // so the fees accounting can be updated correctly.
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            lp_token_constructor_ref,
            option::none(),
            token_name,
            string::utf8(b"LP"),
            LP_TOKEN_DECIMALS,
            string::utf8(b""),
            string::utf8(b"")
        );
        lp_token_constructor_ref
    }

    inline fun create_token_store(pool_signer: &signer, token: Object<Metadata>): Object<FungibleStore> {
        let constructor_ref = &object::create_object_from_object(pool_signer);
        fungible_asset::create_store(constructor_ref, token)
    }
    inline fun unchecked_mut_liquidity_pool_configs(): &mut LiquidityPoolConfigs acquires LiquidityPoolConfigs {
        borrow_global_mut<LiquidityPoolConfigs>(address_of(&package_manager::get_signer()))
    }

    public  fun create_pool_CoFA<CoinA>(y_meta:Object<Metadata>,period:u64):Object<Pool> acquires LiquidityPoolConfigs {
        let op_FA=paired_metadata<CoinA>();
        assert!(option::is_none(&op_FA) == false ,error::not_implemented(E_no_pair_metadata));
        let fa=*option::borrow(&op_FA);
        let pool = create_pool_FAFA(fa,y_meta,period);
        pool
    }

    public  fun create_pool_FAFA(x_metadata:Object<Metadata>,y_metadata:Object<Metadata>,period1:u64):Object<Pool> acquires LiquidityPoolConfigs {
        if (!is_sorted(x_metadata, y_metadata)) {
            return create_pool_FAFA(y_metadata, x_metadata, period1)
        };
        let pool_constructor_ref = create_lp_token(x_metadata, y_metadata);
        let pool_signer = &object::generate_signer(pool_constructor_ref);
        let lp_token = object::object_from_constructor_ref<Metadata>(pool_constructor_ref);
        let configs= unchecked_mut_liquidity_pool_configs();
        fungible_asset::create_store(pool_constructor_ref, lp_token);
        move_to(pool_signer ,Pool{
            x_coin:create_token_store(pool_signer,x_metadata),
            y_coin:create_token_store(pool_signer,y_metadata),
            lp_ref:  LPref{
                mint_ref:generate_mint_ref(pool_constructor_ref),
                burn_ref:generate_burn_ref(pool_constructor_ref),
                tran_ref:generate_transfer_ref(pool_constructor_ref)
            },
            fee_1:20,
            init_price:0,
            init_size_x:0,
            init_size_y:0,
            period:period1
        });
        move_to(pool_signer, FeesAccounting {
            total_fees_1: 0,
            total_fees_2: 0,
            total_fees_at_last_claim_1: smart_table::new(),
            total_fees_at_last_claim_2: smart_table::new(),
            claimable_1: smart_table::new(),
            claimable_2: smart_table::new(),
        });
        let pool = object::convert(lp_token);
        smart_vector::push_back(&mut configs.all_pools, pool);
        event::emit(CreatePool{pool,token_1:x_metadata,token_2:y_metadata});
        pool
    }

    fun swap_COFA<CoinA>(caller:&signer,y_meta:Object<Metadata>,table_name:String,swap_amount:u64) acquires Pool, FeesAccounting {
        let op_FA=paired_metadata<CoinA>();
        assert!(option::is_none(&op_FA) == false ,error::not_implemented(E_no_pair_metadata));
        let fa=*option::borrow(&op_FA);
        swap_FAFA(caller,fa,y_meta,table_name,swap_amount);
    }

     public fun swap_FAFA(caller:&signer,x_metadata:Object<Metadata>,y_metadata:Object<Metadata>,table_name:String,swap_amount:u64) acquires Pool, FeesAccounting {

        let (box_total,box_init) = list::ask_person(address_of(caller),x_metadata,table_name);
        let pool =liquidity_pool(x_metadata,y_metadata);
        let in =primary_fungible_store::withdraw(caller, x_metadata, swap_amount);

        // when have data with user
        // cal the swap price and box'
         let in_balance = fungible_asset::amount(&in);
        let out = swap_action(pool,in);

        let out_balance =  fungible_asset::amount(&out);
        let price = (out_balance *1000 / in_balance)/1000;
        let buy_or_sell = list::ask_buy_or_sell(x_metadata,y_metadata,table_name);

        let period = list::ask_period_compare(table_name);
        let int_price = list::ask_orginal_price(table_name,x_metadata);

        list::swap_entry(caller,swap_amount,ask_init_price(pool),table_name,x_metadata,buy_or_sell,price);
        //assert!(option::is_none(&box_init) == false,error::not_implemented(E_empty_box));
        if(option::is_none(&box_init) == true){
            primary_fungible_store::deposit(address_of(caller), out);
        }else{
            let (user_fun,limit_fun)=limit::calculate_final(out,(*option::borrow(&box_init) as u64),price,int_price, to_u64(*string::bytes(&period)));
            primary_fungible_store::deposit(address_of(&get_limit_signer()),limit_fun);
            primary_fungible_store::deposit(address_of(caller), user_fun);
        }
    }

    /// swap coin to be token
    public entry fun buy_action<CoinA>(caller:&signer,y_meta:Object<Metadata>,table_name:String,period:String,swap_amount:u64) acquires Pool, FeesAccounting {
        let op_FA=paired_metadata<CoinA>();
        assert!(option::is_none(&op_FA) == false ,error::not_implemented(E_no_pair_metadata));
        let fa=*option::borrow(&op_FA);
        let pool =liquidity_pool(fa,y_meta);

        let in =primary_fungible_store::withdraw(caller, y_meta, swap_amount);
        let in_balance = fungible_asset::amount(&in);
        let out = swap_action(pool,in);
        let out_balance =  fungible_asset::amount(&out);
        let price = (out_balance *1000 / in_balance)/1000;

        list::swap_entry(caller,swap_amount,ask_init_price(pool),table_name,y_meta,utf8(b"buy"),price);

        primary_fungible_store::deposit(address_of(caller),out);
        emit(SwapEvent{
            pool,
            from_token:fa,
            amount_in:in_balance,
            amount_out:out_balance,
            fee_charge:0
        });
    }
    ///sell token by limit coeifienet,but none box will assert
    public entry fun sell_action<CoinA>(caller:&signer,y_metadata:Object<Metadata>,table_name:String,swap_amount:u64) acquires Pool, FeesAccounting {
        let op_FA = paired_metadata<CoinA>();
        assert!(option::is_none(&op_FA) == false, error::not_implemented(E_no_pair_metadata));
        let fa = *option::borrow(&op_FA);

        let (box_total, box_init) = list::ask_person(address_of(caller), y_metadata, table_name);
        let pool = liquidity_pool(fa, y_metadata);
        let in = primary_fungible_store::withdraw(caller, y_metadata, swap_amount);
        let in_balance = fungible_asset::amount(&in);
        let out = swap_action(pool, in);
        let out_balance =  fungible_asset::amount(&out);
        let price = (in_balance *1000 / out_balance)/1000;

        let period = list::ask_period_compare(table_name);
        let int_price = list::ask_orginal_price(table_name, y_metadata);
        list::swap_entry(caller,swap_amount,ask_init_price(pool),table_name, y_metadata,utf8(b"sell"),price);
        assert!(option::is_none(&box_init) == false,error::not_implemented(E_empty_box));

        let (user_fun,limit_fun)=limit::calculate_final(out,(*option::borrow(&box_init) as u64),price,int_price, to_u64(*string::bytes(&period)));
        primary_fungible_store::deposit(address_of(&get_limit_signer()),limit_fun);
        primary_fungible_store::deposit(address_of(caller), user_fun);
    }

    fun swap_action(pool:Object<Pool>,from_fa:FungibleAsset):FungibleAsset acquires Pool, FeesAccounting {
        let from_token = fungible_asset::asset_metadata(&from_fa);
        let amount_in = fungible_asset::amount(&from_fa);
        let (amount_out, fees_amount) = get_amount_out(pool,from_token, amount_in);
        let fees = fungible_asset::extract(&mut from_fa, fees_amount);

        let pool_data = borrow_global<Pool>(object_address(&pool));
        let k_before = calculate_constant_k(pool_data);
        let fees_accounting =  borrow_global_mut<FeesAccounting>(object::object_address(&pool));
        let store_1 = pool_data.x_coin;
        let store_2 = pool_data.y_coin;
        let swap_signer = &package_manager::get_signer();
        let fees_amount = (fees_amount as u128);
        let out = if (from_token == fungible_asset::store_metadata(pool_data.x_coin)) {
            // User's swapping token 1 for token 2.
            fungible_asset::deposit(store_1, from_fa);
            fungible_asset::deposit(pool_data.x_coin, fees);
            fees_accounting.total_fees_1 = fees_accounting.total_fees_1 + fees_amount;
            fungible_asset::withdraw(swap_signer, store_2, amount_out)
        }else {
            // User's swapping token 2 for token 1.
            fungible_asset::deposit(store_2, from_fa);
            fungible_asset::deposit(pool_data.y_coin, fees);
            fees_accounting.total_fees_2 = fees_accounting.total_fees_2 + fees_amount;
            fungible_asset::withdraw(swap_signer, store_1, amount_out)
        };
        let k_after = calculate_constant_k(pool_data);
        assert!(k_before <= k_after, EK_BEFORE_SWAP_GREATER_THAN_EK_AFTER_SWAP);
        emit(SwapEvent{
            pool,
            from_token,
            amount_in,
            amount_out,
            fee_charge: (fees_amount as u64)
        });
        out
    }

    #[view]
    public fun lp_token_supply<T: key>(pool: Object<T>): u128 {
        option::destroy_some(fungible_asset::supply(pool))
    }

    #[view]
    public fun pool_reserves<T: key>(pool: Object<T>): (u64, u64) acquires Pool {
        let pool_data = borrow_global<Pool>(object_address(&pool));
        (
            fungible_asset::balance(pool_data.x_coin),
            fungible_asset::balance(pool_data.y_coin),
        )
    }

    #[view]
    /// Returns the optimal amounts of tokens to provide as liquidity given the desired amount of each token to add.
    /// The returned values are the amounts of token 1, token 2, and LP tokens received.
    public fun optimal_liquidity_amounts(
        token_1: Object<Metadata>,
        token_2: Object<Metadata>,
        amount_1_desired: u64,
        amount_2_desired: u64,
        amount_1_min: u64,
        amount_2_min: u64,
    ): (u64, u64, u64) acquires Pool {
        let pool = liquidity_pool(token_1, token_2);
        let (reserves_1, reserves_2) = pool_reserves(pool);
        // Reverse the reserve numbers if token 1 and token 2 don't match the pool's token order.
        if (!is_sorted(token_1, token_2)) {
            (reserves_1, reserves_2) = (reserves_2, reserves_1);
        };
        let amount_1_desired = (amount_1_desired as u128);
        let amount_2_desired = (amount_2_desired as u128);
        let amount_1_min = (amount_1_min as u128);
        let amount_2_min = (amount_2_min as u128);
        let reserves_1 = (reserves_1 as u128);
        let reserves_2 = (reserves_2 as u128);
        let lp_token_total_supply = lp_token_supply(pool);
        let (amount_1, amount_2) = (amount_1_desired, amount_2_desired);
        let liquidity = if (lp_token_total_supply == 0) {
            math128::sqrt(amount_1 * amount_2) - (MINIMUM_LIQUIDITY as u128)
        } else if (reserves_1 > 0 && reserves_2 > 0) {
            let amount_2_optimal = math128::mul_div(amount_1_desired, reserves_2, reserves_1);
            if (amount_2 <= amount_2_desired) {
                assert!(amount_2_optimal >= amount_2_min, EINSUFFICIENT_OUTPUT_AMOUNT);
                amount_2 = amount_2_optimal;
            } else {
                amount_1 = math128::mul_div(amount_2_desired, reserves_1, reserves_2);
                assert!(amount_1 <= amount_1_desired && amount_1 >= amount_1_min, EINSUFFICIENT_OUTPUT_AMOUNT);
            };
            math128::min(
                amount_1 * lp_token_total_supply / reserves_1,
                amount_2 * lp_token_total_supply / reserves_2,
            )
        } else {
            abort EINFINITY_POOL
        };

        ((amount_1 as u64), (amount_2 as u64), (liquidity as u64))
    }

    public entry fun add_liquidity_COFA<CoinA>(caller:&signer,token:Object<Metadata>,token_amount1:u64,token_amount2:u64) acquires Pool {
        // let op_FA=paired_metadata<CoinA>();
        // assert!(option::is_none(&op_FA) == false ,error::not_implemented(E_no_pair_metadata));
        let coin = coin::withdraw<CoinA>(caller,token_amount1);
        let fa1 =coin::coin_to_fungible_asset(coin);
        let fa2 =primary_fungible_store::withdraw(caller,token,token_amount2);
        add_liquidity(caller,fa1,fa2);
    }

    public  fun add_liquidity(caller:&signer,coin1:FungibleAsset,coin2:FungibleAsset) acquires Pool {
        assert!(address_of(caller) == @admin || address_of(caller) == @admin1 || address_of(caller) == @all_or_nothing,error::permission_denied(E_not_admin));
        let fa1 = fungible_asset::metadata_from_asset(&coin1);
        let fa2= fungible_asset::metadata_from_asset(&coin2);
        let lq_pool_addresss = liquidity_pool_address(fa1,fa2);
        if (!is_sorted(fa1, fa2)) {
          return add_liquidity(caller,coin2,coin1)
        };
        let token_1_balance = fungible_asset::amount(&coin1);
        let token_2_balance =fungible_asset::amount(&coin2);
        mint(caller, coin1,coin2);
        let borrow =  borrow_global_mut<Pool>(lq_pool_addresss);
        borrow.init_size_x = borrow.init_size_x+token_1_balance ;
        borrow.init_size_y = borrow.init_size_y+token_2_balance ;
        borrow.init_price = ((token_2_balance*10000)/token_1_balance)/10000;

    }

    fun ensure_lp_token_store<T: key>(lp: address, pool: Object<T>): Object<FungibleStore> acquires Pool {
        primary_fungible_store::ensure_primary_store_exists(lp, pool);
        let store = primary_fungible_store::primary_store(lp, pool);
        if (!fungible_asset::is_frozen(store)) {
            // LPs must call transfer here to transfer the LP tokens so claimable fees can be updated correctly.
            let transfer_ref = &borrow_global<Pool>(object_address(&pool)).lp_ref.tran_ref;
            fungible_asset::set_frozen_flag(transfer_ref, store, true);
        };
        store
    }

    /// Mint LP tokens for the given liquidity. Note that the LP would receive a smaller amount of LP tokens if the
    /// amounts of liquidity provided are not optimal (do not conform with the constant formula of the pool). Users
    /// should compute the optimal amounts before calling this function.
    public fun mint(
        lp: &signer,
        fungible_asset_1: FungibleAsset,
        fungible_asset_2: FungibleAsset,
    ) acquires  Pool {
        let token_1 = fungible_asset::metadata_from_asset(&fungible_asset_1);
        let token_2 = fungible_asset::metadata_from_asset(&fungible_asset_2);
        if (!is_sorted(token_1, token_2)) {
            return mint(lp, fungible_asset_2, fungible_asset_1)
        };
        // The LP store needs to exist before we can mint LP tokens.
        let pool = liquidity_pool(token_1, token_2);
        let lp_store = ensure_lp_token_store(address_of(lp), pool);
        let amount_1 = fungible_asset::amount(&fungible_asset_1);
        let amount_2 = fungible_asset::amount(&fungible_asset_2);
        assert!(amount_1 > 0 && amount_2 > 0, EZERO_AMOUNT);
        let pool_data = borrow_global<Pool>(object_address(&pool));

        let store_1 = pool_data.x_coin;
        let store_2 = pool_data.y_coin;

        // Before depositing the added liquidity, compute the amount of LP tokens the LP will receive.
        let reserve_1 = fungible_asset::balance(store_1);
        let reserve_2 = fungible_asset::balance(store_2);
        let lp_token_supply = option::destroy_some(fungible_asset::supply(pool));
        let mint_ref = &pool_data.lp_ref.mint_ref;
        let liquidity_token_amount = if (lp_token_supply == 0) {
            let total_liquidity = (math128::sqrt((amount_1 as u128) * (amount_2 as u128)) as u64);
            // Permanently lock the first MINIMUM_LIQUIDITY tokens.
            fungible_asset::mint_to(mint_ref, pool, MINIMUM_LIQUIDITY);
            total_liquidity - MINIMUM_LIQUIDITY
        } else {
            // Only the smaller amount between the token 1 or token 2 is considered. Users should make sure to either
            // use the router module or calculate the optimal amounts to provide before calling this function.
            let token_1_liquidity = math64::mul_div(amount_1, (lp_token_supply as u64), reserve_1);
            let token_2_liquidity = math64::mul_div(amount_2, (lp_token_supply as u64), reserve_2);
            math64::min(token_1_liquidity, token_2_liquidity)
        };
        assert!(liquidity_token_amount > 0, EINSUFFICIENT_LIQUIDITY_MINTED);

        // Deposit the received liquidity into the pool.
        fungible_asset::deposit(store_1, fungible_asset_1);
        fungible_asset::deposit(store_2, fungible_asset_2);

        // We need to update the amount of rewards claimable by this LP token store if they already have a previous
        // balance. This ensures that their update balance would not lead to earning a larger portion of the fees
        // retroactively.
       // update_claimable_fees(address_of(lp), pool);

        // Mint the corresponding amount of LP tokens to the LP.
        let lp_tokens = fungible_asset::mint(mint_ref, liquidity_token_amount);
        fungible_asset::deposit_with_ref(&pool_data.lp_ref.tran_ref, lp_store, lp_tokens);
    }


     fun init_module(caller:&signer){
        //assert!(address_of(caller) == @admin || address_of(caller) == @admin1,error::not_implemented(E_not_admin));
        let swap_signer = &package_manager::get_signer();
        move_to(swap_signer, LiquidityPoolConfigs {
            all_pools: smart_vector::new(),
            is_paused: false,
            fee_manager: @admin,
            pauser: @admin,
            pending_fee_manager: @0x0,
            pending_pauser: @0x0,
            stable_fee_bps: 10, // 0.1%
            volatile_fee_bps: 20, // 0.2%
        });
        let obj = create_named_object(swap_signer,Limit_seed);
        let obj_signer = generate_signer(&obj);

        move_to(&obj_signer,Cap_control{
            ext:generate_extend_ref(&obj)
        })

    }

    inline fun calculate_constant_k(pool: &Pool): u256 {
        let r1 = (fungible_asset::balance(pool.x_coin) as u256);
        let r2 = (fungible_asset::balance(pool.y_coin) as u256);
            // k = x * y. This is standard constant product for volatile asset pairs.
            r1 * r2
    }


    #[test_only]
    public fun call_create_pool(x_metadata:Object<Metadata>,y_metadata:Object<Metadata>) acquires LiquidityPoolConfigs {
        create_pool_FAFA(x_metadata,y_metadata,100);
    }
    #[test_only]
    public fun call_liquidty_init(caller:&signer){
        init_module(caller)
    }
    #[view]
    public fun ask_init_price(pool:Object<Pool>):u64 acquires Pool {
        borrow_global<Pool>(object_address(&pool)).init_price
    }


    public(friend) fun draw_all_token(pool:Object<Pool>,token:Object<Metadata>,amount:u256):FungibleAsset acquires Pool {
        let borrow = borrow_global<Pool>(object_address(&pool));
        let b1 = store_metadata(borrow.x_coin);
        let b2 =store_metadata(borrow.y_coin);
        if(token == b2){
            let out = fungible_asset::withdraw(&package_manager::get_signer(),borrow.x_coin, (amount as u64));
            return out
        }else if (token == b1){
            let out = fungible_asset::withdraw(&package_manager::get_signer(),borrow.y_coin, (amount as u64));
            return out
        }else{
            abort E_no_pair_metadata
        }
    }
    public  fun get_balance(pool:Object<Pool>,token:Object<Metadata>):(u256,u256) acquires Pool {
        let (r1,r2)=reverse(pool);
        let borrow = borrow_global<Pool>(object_address(&pool));
        let b1 = store_metadata(borrow.x_coin);
        let b2 =store_metadata(borrow.y_coin);
        if(token == b1){
            return(r1,r2)
        }else if (token == b2){
            return(r2,r1)
        }else{
            abort E_no_pair_metadata
        }
    }
}
