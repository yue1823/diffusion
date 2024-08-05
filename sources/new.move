module dapp::new {

    use std::option;
    use std::string;
    use std::vector;
    use std::coin;
    use std::signer;
    use std::account;

    use aptos_framework::account::{SignerCapability, create_signer_with_capability, create_resource_address};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{MintCapability, is_account_registered, register};
    use aptos_framework::object;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use std::aptos_account;
    use std::string::{length, utf8};
    use std::vector::find;
    use aptos_std::big_vector::push_back;
    use aptos_std::bls12381::verify_aggregate_signature;
    use aptos_std::string_utils;
    use aptos_framework::aptos_account::{transfer, batch_transfer, batch_transfer_coins};
    use aptos_framework::timestamp;
    use aptos_token_objects::royalty::create;
    use aptos_token_objects::token::Token;
    #[test_only]
    use aptos_std::debug;
    #[test_only]
    use aptos_framework::aptos_coin;


    const APT_address : vector<u8> = b"0x1::aptos_coin::AptosCoin";
    const Seed:vector<u8> = b"asf";
    const Garble_Seed : vector<u8> = b"Seed for garble";
    const Helper_Seed:vector<u8> = b"helper_love";
    const Bank_Seed:vector<u8> = b"bank of diffusion";


    const Diffusion_loyalty_name:vector<u8> = b"loyalty";
    const Diffusion_loyalty_symbol:vector<u8> = b"Dfp";
    const Diffusion_loyalty_decimals:u8 = 0;

    const Collection_name_token_describe:vector<u8> =b"Diffusion Collection";
    const Collection_name:vector<u8> = b"Diffusion";
    const Description_nft:vector<u8> = b"You are really lucky to get this one XD .Fist collection of Diffusion (I won't sell it lower than 1 APT ^_^) ";
    const Name_nft:vector<u8> = b"Diffusion";
    const Url_nft:vector<u8> = b"https://pot-124.4everland.store/diffusion.jpeg";

    ////////// Error Code //////////////
    const Not_admin:u64=1;
    const NOT_enought_balance :u64 = 30;
    const Empty_input :u64 = 31;
    const NO_zero_input : u64 =32;
    const Iuput_of_length_not_same:u64 =33;
    const Dont_have_this_cylinder:u64 =34;
    ////////// Error Code //////////////

    //////// Other Moduler Struct //////

    struct ResourceCap has key{
        cap:SignerCapability

    }


    //////// New struct //////////
    struct Rndom_Seed has key,copy,store{
        random_seed1:u64,
        random_seed2:u64
    }
    struct Badges has key , copy,store{
        Name:string::String,
        url:string::String
    }
    struct Level has key,copy,store{
        level:u64,
        win:u64,
        lose:u64,
        diffusion_loyalty:u64,
    }
    struct Account_tree has key,copy,store {
        save_1:Profile ,
        save_2:vector<Bet_card>,
        save_3:Rndom_Seed,
        save_4:vector<Badges>,
        save_5:Level
    }

    struct Diffusion_store_tree has key,drop,copy,store{
        save_Pair_result_store:Pair_result_store,
        save_Helper_list:Helper_list,
        fee:Diffusion_fee,
        save_helper_chance:Chance,
        save_Cylinder_Pairs:vector<Cylinder_Pairs>
    }

    struct Cylinder_Pairs has key,store,drop,copy{
        coin:string::String,
        coin_address:address,
        pair_number:u64,
        save_number:u64,
        save_total:u64,
        send_address_vector:vector<address>,
        send_amount_vector:vector<u64>,
        already_send:u64
    }

    struct Cap_of_diffusion has key {
        diffusion_point_mint_cap:MintCapability<Diffusion_loyalty>,
        mutator_ref:collection::MutatorRef,
    }
    struct TokenRefsStore has key {
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
        extend_ref: object::ExtendRef,
        transfer_ref: option::Option<object::TransferRef>
    }
    struct Diffusion_loyalty has key{}
    struct CollectionRefsStore has key{

        mutator_ref:collection::MutatorRef,

    }
    //////// New struct //////////
    struct Pair_result_store has key,drop,copy,store {
        save_admin_set_result:vector<bool>,
        save_can_claim:vector<bool>,
        save_result:vector<u8>,
        save_pair:vector<Pair>,
        save_chips : vector<Chips>
    }
    struct Pair has key,drop,copy,store{
        pair_type:string::String,
        pair_name:string::String,
        left:u64,
        middle:u64,
        right:u64,
        expired_time:u64
    }

    struct Chips has key,store,copy,drop{
        left:u64,
        middle:u64,
        right:u64,
        given:u64
    }
    struct Bet_card has key,store,drop,copy {
        account:address,
        which:u8,
        pair:Pair,
        bet:u64,
        a_win:u64,
        b_win:u64,
        c_win:u64,
        time:u64
    }
    struct Profile has key,store,copy{
        name:string::String,
        account_address:address,
        icon:string::String,
        account_Amount:u64
    }
    struct Diffusion_fee has key,copy,store,drop{
        margin:u64,
        fees_1:u64,
        fees_2:u64,
        allocation_share_1:u64,
        allocation_share_2:u64,
        bank_share_1:u64,
        bank_share_2:u64,
        nft_chance_1:u64,
        nft_chance_2:u64,
        nft_id:u64
    }
    struct Helper_upload_result has key,drop,copy,store{
        pair:Pair,
        result:u8,
        upload_time:u64,
        right_or_not:vector<bool>
    }

    struct Helper has key,drop,copy,store{
        account:address,
        helper_contribute:vector<Helper_upload_result>,
        helper_point:u64,
        upload_times:u64,
        wrong_times:u64,
        pay_margin:bool,
        need_admin:bool
    }
    struct Helper_allocation has key,copy,store,drop{
        pair:Pair,
        allocation:u64,
        time_period:string::String,
        ended:bool
    }
    struct Helper_list has key,drop,copy,store{
        list:vector<Helper>,
        period:vector<Helper_allocation>
    }
    struct Chance has key,drop,copy,store{
        maximun_helper_num:u64,
        heler_number:u64,
        least_helper_result:u8,
        chance_for_wrong_time:u8,
    }
    //////// Other Moduler Struct //////

    //////// User Function ////////////
    public entry fun reload_batch<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:vector<u64>,to_address:vector<address>,coin:string::String,coin_address:address,send_coin_amount:u64) acquires ResourceCap, Diffusion_store_tree, Account_tree {
        let resources_signer = create_signer_with_capability(&borrow_global<ResourceCap>(create_resource_address(&@dapp,Garble_Seed)).cap);
        assert!(coin::balance<AptosCoin>(signer::address_of(caller)) >= check_total_of_input_vector_amount(amount), NOT_enought_balance);
        assert!(!vector::is_empty(&amount),Empty_input);
        assert!(check_total_of_input_vector_amount(amount) != 0,NO_zero_input);
        assert!(vector::length(&amount) == vector::length(&to_address),Iuput_of_length_not_same);

        pay_to_garble_resource_address<CoinA>(caller,check_total_of_input_vector_amount(amount));


        if((need_garble == true) && (need_swap == false)) {
            push_vector_to_main_tree(amount,to_address,coin,coin_address,send_coin_amount);
            send_batch_transfer<CoinA>(&resources_signer, coin, coin_address, send_coin_amount);
        }else if((need_garble == false) && (need_swap == false)){
            if (coin == utf8(APT_address)) {
                batch_transfer(caller, to_address, amount);
                //clean_vector(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs, find_coin_index_in_main_tree(coin,coin_address,send_coin_amount)));
            }else {
                batch_transfer_coins<CoinA>(caller, to_address, amount);
                //clean_vector(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs, find_coin_index_in_main_tree(coin,coin_address,send_coin_amount)));
            };
        }else if ((need_garble ==true) && (need_swap == true)){

        }else if((need_garble ==false) && (need_swap == true)){};

        nft_random(caller);
        add_point_to_user(caller);
    }
    public entry fun reload_single<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:u64,to_address:address,coin:string::String,coin_address:address,send_coin_amount:u64) acquires ResourceCap, Diffusion_store_tree, Account_tree {
        let resources_signer = create_signer_with_capability(&borrow_global<ResourceCap>(create_resource_address(&@dapp,Garble_Seed)).cap);
        assert!(coin::balance<AptosCoin>(signer::address_of(caller)) >= amount,NOT_enought_balance);
        assert!(amount != 0,NO_zero_input);
        pay_to_garble_resource_address<CoinA>(caller,amount);
        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        if((need_garble == true) && (need_swap == false)) {
            if(index !=99){
                vector::push_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector,to_address);
                vector::push_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector,amount);
            };
            send_batch_transfer<CoinA>(&resources_signer, coin, coin_address, send_coin_amount);
        }else if((need_garble == false) && (need_swap == false)){
            if (coin == utf8(APT_address)) {
                transfer(&resources_signer,to_address,amount);
           }else {
            };
        }else if ((need_garble ==true) && (need_swap == true)){

        }else if((need_garble ==false) && (need_swap == true)){};

        nft_random(caller);
        add_point_to_user(caller);
    }

    //////// User Function ////////////

    /////// Admin Function ////////////

    /////// Admin Function ////////////

    //////// Pay function ////////

    fun add_point_to_user(caller:&signer) acquires Account_tree {
        borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty=borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty+1;

    }

    fun admin_mint_nft(caller:&signer) acquires ResourceCap, Diffusion_store_tree {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);
        mint_diffustion(caller);

    }
    fun mint_diffustion(caller:&signer) acquires ResourceCap, Diffusion_store_tree {

        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;

        let borrow1 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_id;

        let resource_signer = create_signer_with_capability(borrow);


        let c =utf8(b"___#");
        let d =  string::utf8(Collection_name_token_describe);

        string::append(&mut d,c);
        string::append( &mut d,string_utils::to_string(&borrow1));

        let royalty=create(15,100,@admin1);
        let token_cref = token::create(
            &resource_signer,
            utf8(Name_nft),
            utf8(Collection_name_token_describe),
            d,
            option::some(royalty),
            utf8(Url_nft),
        );


        let token_signer = object::generate_signer(&token_cref);
        let token_mutator_ref = token::generate_mutator_ref(&token_cref);
        let token_burn_ref = token::generate_burn_ref(&token_cref);

        move_to(
            &token_signer,
            TokenRefsStore {
                mutator_ref: token_mutator_ref,
                burn_ref: token_burn_ref,
                extend_ref: object::generate_extend_ref(&token_cref),
                transfer_ref: option::none()
            }
        );
        object::transfer(
            &resource_signer,
            object::object_from_constructor_ref<Token>(&token_cref),
            signer::address_of(caller),
        );

    }

    fun nft_random(caller:&signer) acquires Account_tree, Diffusion_store_tree, ResourceCap {
        let a = borrow_global<Account_tree>(signer::address_of(caller)).save_3.random_seed1;
        let b =  borrow_global<Account_tree>(signer::address_of(caller)).save_3.random_seed2;
        let new_a = a*timestamp::now_microseconds();
        let new_b  = b*timestamp::now_microseconds();
        let result1 = (new_a*borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_1)/borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_2;
        let result2 = (new_b*borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_1)/borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_2;
        if(result1 == result2){
            mint_diffustion(caller);
        }
    }


    fun pay_to_garble_resource_address<CoinA>(caller:&signer,amount:u64) acquires Diffusion_store_tree {
        let fee1 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).fee.fees_1;
        let fee2 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).fee.fees_2;
        let cost = (amount*fee1)/fee2;
        let coin = coin::withdraw<CoinA>(caller,amount+cost);
        coin::deposit<CoinA>(create_resource_address(&@dapp,Garble_Seed),coin);
    }

    fun send_batch_transfer<CoinA>(caller:&signer,coin:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree {
        //need to use resource to be caller
        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        assert!(index != 99 , Dont_have_this_cylinder);

       // let specfic = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index);
        if(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).save_number == vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).send_address_vector)) {
            garble_before_send(coin,coin_address,send_coin_amount);

            if (coin == utf8(APT_address)) {
                batch_transfer(caller, vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).send_address_vector, vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).send_amount_vector);
            }else {
                batch_transfer_coins<CoinA>(caller, vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).send_address_vector, vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).send_amount_vector);
            };

            let amount = check_total_of_input_vector_amount(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).send_amount_vector);

            vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).already_send = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).already_send + amount;
            vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).save_total =vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).save_total - amount;

            clean_vector(coin,coin_address,send_coin_amount);
        }
    }


    //////// Pay function ////////

    //////// Logic fun //////////


    fun clean_vector(coin:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree {
        let i = 0;
        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        let length = vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector);
        while (i < length) {
            if (vector::is_empty(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector)) {}else {
                vector::pop_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector);
            };
            if (vector::is_empty(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector)) {}else {
                vector::pop_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector);
            };

            i = i + 1;
        }
    }
    fun upgrade_level(caller:&signer) acquires Account_tree {
        borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty=borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty+1;

    }

    fun garble_before_send(coin:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree {
        let i=0;
        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);

        let f = vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector);
        let length = vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector);
        while(i < length){
            if(f != i){vector::swap(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector,i,f);};

            f=f-1;
            i=i+i
        }
    }

    fun push_vector_to_main_tree(amount:vector<u64>,to_address:vector<address>,coin:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree {
        let coin_index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        let i =0 ;
        let length = vector::length(&amount);
        if(coin_index!=99){
            let borrow = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,coin_index);

            while (i < length){
                let amount_specfic = vector::borrow(&amount,i);
                let to_address_specfic = vector::borrow(&to_address,i);

                vector::push_back(&mut borrow.send_address_vector,*to_address_specfic);
                vector::push_back(&mut borrow.send_amount_vector,*amount_specfic);

                i=i+1;
            }
        }
    }
    fun find_coin_index_in_main_tree(coin:string::String,coin_address:address,send_coin_amount:u64):u64 acquires Diffusion_store_tree {
        let i = 0;
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs);
        while(i < length ){
            let borrow = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,i);
            if((borrow.coin_address == coin_address) && (borrow.coin == coin) && (borrow.pair_number == send_coin_amount)){
                return i
            };
            i=i+1;
        };
        return 99
    }
    fun check_total_of_input_vector_address(amount:vector<address>):u64{
        let i =0;
        let length = vector::length(&amount);
        let total:u64 = 0;
        while(i < length ){
            i=i+1;
        };
        return total
    }
    fun check_total_of_input_vector_amount(amount:vector<u64>):u64{
        let i =0;
        let length = vector::length(&amount);
        let total:u64 = 0;
        while(i < length ){
            let borrow = vector::borrow(&amount,i);
            total=total+*borrow;
            i=i+1;
        };
        return total
    }




    //////// Logic fun //////////
    fun nft_collection_init(caller:&signer,resource_signer:&signer){

        let royalty = create(15,100,@admin1);  //nft royalty
        let collection=collection::create_unlimited_collection(             //create collection
            resource_signer,
            utf8(Description_nft),
            utf8(Name_nft),
            option::some(royalty),
            utf8( Url_nft)
        );
        let collection_signer =  object::generate_signer(&collection);
        let mutator_ref = aptos_token_objects::collection::generate_mutator_ref(&collection);
        move_to(&collection_signer,
            CollectionRefsStore{
                mutator_ref});
    }

    fun init_module(caller:&signer){
        let (garble_Seed_resource_signer, garble_resource_cap) = account::create_resource_account(
            caller,
            Garble_Seed
        );
        let (helper_resource_signer, helper_resource_cap) = account::create_resource_account(
            caller,
            Helper_Seed
        );
        let (bank_resource_signer, bank_resource_cap) = account::create_resource_account(
            caller,
            Bank_Seed
        );
        let (resource_signer, resource_cap) = account::create_resource_account(
            caller,
            Seed
        );
        move_to(
            &garble_Seed_resource_signer,
            ResourceCap {
                cap:garble_resource_cap
            }
        );
        move_to(&helper_resource_signer,ResourceCap{cap:helper_resource_cap});
        move_to(&bank_resource_signer,ResourceCap{cap:bank_resource_cap});
        move_to(&resource_signer,ResourceCap{cap:resource_cap});
        let diffusion_tree   = Diffusion_store_tree{
            save_Pair_result_store:Pair_result_store{
                save_admin_set_result:vector::empty<bool>(),
                save_can_claim:vector::empty<bool>(),
                save_result:vector::empty<u8>(),
                save_pair:vector::empty<Pair>(),
                save_chips:vector::empty<Chips>(),

            },
            save_Helper_list:Helper_list{
                list:vector::empty<Helper>(),
                period:vector::empty<Helper_allocation>()
            },
            fee:Diffusion_fee{
                margin:500000000,
                fees_1:10,
                fees_2:100,
                allocation_share_1:10,
                allocation_share_2:100,
                bank_share_1:20,
                bank_share_2:100,
                nft_chance_1:10,
                nft_chance_2:100,
                nft_id:0
            },
            save_helper_chance:Chance{
                maximun_helper_num:1000,
                heler_number:4,
                least_helper_result:4,
                chance_for_wrong_time:3
            },
            save_Cylinder_Pairs:vector::empty()
        };
        move_to(&resource_signer,diffusion_tree);
        register<AptosCoin>(&resource_signer);
        register<AptosCoin>(&helper_resource_signer);
        register<AptosCoin>(&bank_resource_signer);
        register<AptosCoin>(&garble_Seed_resource_signer);
        nft_collection_init(caller,&resource_signer);
    }
    //////// Test fun //////////
    #[test(aptos_framework=@aptos_framework,caller=@dapp,admin=@admin1,user1=@0x111,user2=@0x222,to_address1=@0x333,to_address2=@0x444)]
    fun test_new(aptos_framework:&signer,caller:&signer,admin:&signer,user1:&signer,user2:&signer,to_address1:&signer,to_address2:&signer) acquires ResourceCap, Diffusion_store_tree, Account_tree {
        let mint_cap = test_init(aptos_framework,caller);
        prepare_test_Account(admin,&mint_cap);
        prepare_test_Account(user1,&mint_cap);
        prepare_test_Account(user2,&mint_cap);
        prepare_test_Account(to_address1,&mint_cap);
        prepare_test_Account(to_address2,&mint_cap);
        coin::destroy_mint_cap(mint_cap);
        init_module(caller);

        let to_address_vector = vector::empty<address>();
        let to_amount_vector = vector::empty<u64>();
        push_vector_on_test(1,@0x111,to_address_vector,to_amount_vector);


        //reload_single<AptosCoin,AptosCoin>(user1,false,false,100000000,signer::address_of(to_address1),utf8(&APT_address),)



            debug::print(&utf8(b"user1 APT:"));
            debug::print(&coin::balance<AptosCoin>(signer::address_of(user1)));
            debug::print(&utf8(b"user2 APT:"));
            debug::print(&coin::balance<AptosCoin>(signer::address_of(user2)));
            debug::print(&utf8(b"dapp APT:"));
            debug::print(&coin::balance<AptosCoin>(@dapp));
            debug::print(&utf8(b"Garble_Seed_resource APT:"));
            debug::print(&coin::balance<AptosCoin>(create_resource_address(&@dapp,Garble_Seed)));

    }
    #[test_only]
    fun push_vector_on_test(amount:u64,to_address:address,to_address_vector:vector<address>,to_amount_vector:vector<u64>){
       vector::push_back(&mut to_address_vector,to_address);
        vector::push_back(&mut to_amount_vector,amount);
    }

    #[test_only]
    fun test_init(aptos_framework:&signer,caller:&signer):MintCapability<AptosCoin>{
        timestamp::set_time_has_started_for_testing(aptos_framework);
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
            aptos_framework,
            string::utf8(b"TC"),
            string::utf8(b"TC"),
            8,
            false,
        );
        //set_seed(x"0000000000000000000000000000000000000000000000000000000000000000");
        account::create_account_for_test(signer::address_of(caller));
        coin::register<AptosCoin>(caller);
        let coins = coin::mint<AptosCoin>(200000000, &mint_cap);
        coin::deposit(signer::address_of(caller), coins);
        coin::destroy_freeze_cap(freeze_cap);
        coin::destroy_burn_cap(burn_cap);
        mint_cap

    }

    #[test_only]
    fun prepare_test_Account(caller:&signer,mint:&MintCapability<AptosCoin>){
        account::create_account_for_test(signer::address_of(caller));
        coin::register<AptosCoin>(caller);
        let coins = coin::mint<AptosCoin>(200000000, mint);
        coin::deposit(signer::address_of(caller), coins);
    }
    //////// Test fun //////////


}
