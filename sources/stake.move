module all_or_nothing::stake {

    use std::acl::add;
    use std::error;
    use std::error::not_implemented;
    use std::option::some;
    use std::signer::address_of;
    use std::string::{utf8, String};
    use aptos_std::string_utils;
    use aptos_framework::fungible_asset;
    use aptos_framework::fungible_asset::{MintRef, TransferRef, BurnRef, Metadata};
    use aptos_framework::object;
    use aptos_framework::object::{Object, create_named_object, ExtendRef, generate_signer_for_extending};
    use aptos_framework::primary_fungible_store;
    use aptos_framework::primary_fungible_store::deposit;
    use aptos_framework::timestamp;

    use all_or_nothing::liquidity::{create_pool_CoFA, create_pool_FAFA};
    use all_or_nothing::deploy_token::{deployer_two_FA, set_pair_pool};
    use all_or_nothing::package_manager;
    use all_or_nothing::account::{get_vote_power, add_vote_power, add_fozen_vote_power, checek_stake_data,
        minus_voting_balance
    };

    ///not enought vote power to stake
    const E_not_enought_power : u64 =1;
    ///Stake Not end
    const E_not_claim_time :u64 =2 ;

    const Coin_Seed: vector<u8> = b"seed";
    const Coin_maximun_supply:u128 = 8000000000000000;
    const Stake_power:u128 =100000;

    struct Control_ref has key{
        mint_ref:MintRef,
        tran_ref:TransferRef,
        burn_ref:BurnRef,
        meta_data:Object<Metadata>,
        exten_ref:ExtendRef
    }

    public entry fun stake(caller:&signer, balacne:u64,period:u64) acquires Control_ref {
        let borrow = borrow_global<Control_ref>(object::create_object_address(&address_of(&package_manager::get_signer()),Coin_Seed));
        let in = primary_fungible_store::withdraw(caller,borrow.meta_data,balacne);
        deposit(object::create_object_address(&address_of(&package_manager::get_signer()),Coin_Seed),in);

        let power = balacne * period /100000000 ;
        add_vote_power(caller, (power as u128), (period as u128));
    }

    public entry fun unstake(caller:&signer,balance:u64,period:u64) acquires Control_ref {
        let now_time = timestamp::now_seconds();
        assert!(now_time >= period , not_implemented(E_not_claim_time));
        let borrow = borrow_global<Control_ref>(object::create_object_address(&address_of(&package_manager::get_signer()),Coin_Seed));
        checek_stake_data(address_of(caller), (balance as u128), (period as u128));
        let power = balance * period /100000000 ;
        minus_voting_balance(caller, (power as u128));
        let obj_signer = &generate_signer_for_extending(&borrow.exten_ref);
        let out = primary_fungible_store::withdraw(obj_signer,borrow.meta_data,balance);
        primary_fungible_store::deposit(address_of(caller),out);
    }

    inline fun check_power(caller:&signer,power_required:u128){
        let enought = required_vote_power(caller,power_required);
        assert!(enought == true , error::not_implemented(E_not_enought_power));
    }

    fun required_vote_power(caller:&signer,vote_power_required:u128):bool{
        let (vote_balance,vote_active,vote_fozen) = get_vote_power(address_of(caller));
        vote_active >= vote_power_required
    }




    public entry fun init_for_stake(caller:&signer){
        assert!(address_of(caller) == @admin || address_of(caller) == @admin1);
        let obj_conf = &create_named_object(&package_manager::get_signer(),Coin_Seed);
        primary_fungible_store::create_primary_store_enabled_fungible_asset(obj_conf,some(Coin_maximun_supply),utf8(b"Diffusion coin"),utf8(b"DFC"),8,utf8(b""),utf8(b""));
        let mint_ref = fungible_asset::generate_mint_ref(obj_conf);
        let burn_ref= fungible_asset::generate_burn_ref(obj_conf);
        let tran_ref = fungible_asset::generate_transfer_ref(obj_conf);
        let meta_data = object::object_from_constructor_ref<Metadata>(obj_conf);
        let exten_ref = object::generate_extend_ref(obj_conf);
        let obj_signer = object::generate_signer(obj_conf);


        move_to(&obj_signer,Control_ref{
            tran_ref,
            mint_ref,
            meta_data,
            exten_ref,
            burn_ref
        });
    }

    public entry fun mint_some(caller:&signer) acquires Control_ref {
        assert!(address_of(caller) == @admin || address_of(caller) == @admin1);
        let borrow = borrow_global<Control_ref>(object::create_object_address(&address_of(&package_manager::get_signer()),Coin_Seed));
        primary_fungible_store::mint(&borrow.mint_ref,address_of(caller),100000000);
    }


    public entry fun create_prediction_market_FA(caller:&signer,period:u128,question:String,token_1_name:vector<u8>,token_2_name:vector<u8>,t1_url:String,t2_url:String,in:Object<Metadata>){
        check_power(caller,Stake_power);
        add_fozen_vote_power(caller,Stake_power);
        let table_name = string_utils::to_string(&period);
        table_name.append(utf8(b"#"));
        table_name.append(question);
        let (fa1,fa2)=deployer_two_FA(caller,question,token_1_name,token_2_name,t1_url,t2_url,period,table_name);
        let (p1,p2)= (create_pool_FAFA(fa1,in, (period as u64)),create_pool_FAFA(fa2,in, (period as u64)));
    }
    public entry fun create_prediction_market_COFA<CoinA>(caller:&signer,period:u128,question:String,token_1_name:vector<u8>,token_2_name:vector<u8>,t1_url:String,t2_url:String){
        check_power(caller,Stake_power);
        add_fozen_vote_power(caller,Stake_power);
        let table_name = string_utils::to_string(&period);
        table_name.append(utf8(b"#"));
        table_name.append(question);
        let (fa1,fa2)=deployer_two_FA(caller,question,token_1_name,token_2_name,t1_url,t2_url,period,table_name);

        let (p1,p2)= (create_pool_CoFA<CoinA>(fa1, (period as u64)),create_pool_CoFA<CoinA>(fa2, (period as u64)));

        set_pair_pool(p1,fa1,table_name);
        set_pair_pool(p2,fa2,table_name);
    }
}
