module dapp::pay_module{
    use std::string::{String, append, utf8};
    use dapp::test_module;
    use dapp::transfer_module;
    use std::coin;
    use std::option;
    use std::option::{is_none, Option};
    use std::signer;
    use std::signer::address_of;
    use std::string;
    use std::vector;
    use std::vector::{length, is_empty};
    use aptos_std::big_vector::push_back;
    use aptos_std::debug;
    use aptos_std::smart_vector::clear;
    use aptos_std::string_utils;
    use aptos_std::table_with_length::empty;
    use aptos_framework::account;
    use aptos_framework::account::{create_resource_address, SignerCapability, create_signer_with_capability};

    use aptos_framework::aptos_account::{transfer_coins, batch_transfer};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{transfer, is_account_registered, balance, BurnCapability, FreezeCapability,
        MintCapability, deposit
    };

    use aptos_framework::object;

    use aptos_framework::randomness;
    use aptos_token_objects::collection;

    use dapp::admin_module;
    use dapp::roll;


    use aptos_token_objects::royalty::{create};
    use aptos_token_objects::token;
    use aptos_token_objects::token::Token;

    #[test_only]
    use std::hash;
    #[test_only]
    use aptos_framework::account::{ create_account_for_test};
    #[test_only]
    use aptos_framework::coin::{destroy_burn_cap, register};
    #[test_only]
    use aptos_framework::system_addresses;
    #[test_only]
    use aptos_framework::timestamp;
    #[test_only]
    use aptos_framework::transaction_context;
    const DST: vector<u8> = b"APTOS_RANDOMNESS";

    const Diffusion_loyalty_name:vector<u8> = b"loyalty";
    const Diffusion_loyalty_symbol:vector<u8> = b"Dfp";
    const Diffusion_loyalty_decimals:u8 = 8;

    const Collection_name_token_describe:vector<u8> =b"You are really lucky to get this one XD ";
    const Collection_name:vector<u8> = b"Diffusion";
    const Description_nft:vector<u8> = b"Fist collection of Diffusion (I won't sell it lower than 1 APT ^_^) ";
    const Name_nft:vector<u8> = b"Diffusion";
    const Url_nft:vector<u8> = b"https://pot-124.4everland.store/diffusion.jpeg";
    const Seed:vector<u8> = b"asf";
    const Wrong_type:u64 = 1;

    const RESOUREC_already_exist : u64 = 2;
    const Cylinder_already_exist : u64  = 3;
    const To_address_not_exists: u64 = 4;
    const Addess_not_exist  : u64 = 5;
    const Amount_is_zero : u64 = 6;
    const Amount_is_emty : u64 = 7;
    const Address_is_emty : u64 = 8;
    const Not_same_address_with_caller :u64 = 9;
    const Not_admin:u64 = 12;
    const Amount_is_smaller_than_zero :u64 = 15;
    const To_address_same_with_dapp :u64 = 16;
    const To_address_same_with_resource_address :u64 = 17;
    const Bullet_amount_emty :u64 = 18;
    const Bullet_address_emty :u64 = 19;
    const To_address_same_with_caller : u64 = 30;
    const Init_for_Setup_no_resourcecap :u64 = 31;
    const Init_for_Setup_no_Diffustion_coin_cap :u64 = 32;
    const Init_for_Setup_no_PerBlockRandomness :u64 = 33;
    const Amount_is_zero_1:u64 = 99;
    const Amount_is_zero_2:u64 = 98;
    const Amount_is_zero_3:u64 = 97;
    const Amount_is_zero_4:u64 = 96;
    const Amount_is_zero_5:u64 = 95;
    const Address_not_same_with_resource_1:u64 = 94;
    const Address_not_same_with_resource_2:u64 = 93;
    const Address_not_same_with_resource_3:u64 = 92;
    const Address_not_same_with_resource_4:u64 = 91;
    const Address_not_same_with_resource_5:u64 = 90;





    // public entry fun test_another_contract_reloadreload<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:u64,to_address:address,from_address:address,coin:String) acquires Cylinder, ResourceCap {
    //     0xd9bff56c4c93e3833677b1c4915e9a3d4fa9593ef8430b4dca03ea360e470de4::pay_module::reload(caller,need_swap,need_garble,amount,to_address,from_address,coin);
    // }




    const Fixed_price:u64 = 10000000;
    struct PerBlockRandomness has drop, key {
        epoch: u64,
        round: u64,
        seed: Option<vector<u8>>,
    }

    struct Diffusion_loyalty has key{}
    struct Reward has key {
        id : u8,
    }

    struct Address_list has drop,store{
        list:address
    }
    struct Amount_list has drop,store{
        list:u64
    }
    struct ResourceCap has key{
        cap:SignerCapability
    }

    struct Cylinder_coin has key,store{
        Coin:String,
        address:vector<address>,
        amount:vector<u64>
    }
    #[event]
    struct Cylinder has key,store{
        id:u8,
        Bullet:Cylinder_coin
    }
    struct CollectionRefsStore has key{

        mutator_ref:collection::MutatorRef,

    }
    struct Diffustion_coin_cap has key {
        mint:MintCapability<Diffusion_loyalty>
    }
    struct TokenRefsStore has key {
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
        extend_ref: object::ExtendRef,
        transfer_ref: option::Option<object::TransferRef>
    }
    #[view]
    public  fun view_length_of_vector():u64 acquires Cylinder {
        let borrow = borrow_global<Cylinder>(create_resource_address(&@dapp,Seed));
        length(&borrow.Bullet.address)
    }

    fun create_address_list(address:address):Address_list{
        Address_list{list:address}
    }
    fun create_amount_list(amount:u64):Amount_list{
        Amount_list{list:amount}
    }
    fun check_dapp_isnt_registered<CoinA>(caller:&signer){
        if(is_account_registered<CoinA>(@dapp)){}else{coin::register<CoinA>(caller)}
    }
    fun check_enough_bullet(v:vector<address>,v1:vector<u64>):bool {
        if(length(&v)==5 && length(&v1)==5){
            true
        }else{false}
    }
    fun pay_diffusion_loyalty_point(caller:&signer,to_address:address) acquires  Diffustion_coin_cap  {
        if((balance<Diffusion_loyalty>(signer::address_of(caller)) > 1 )){
            coin::transfer<Diffusion_loyalty>(caller,to_address,1)
        }else{
            let a = &borrow_global<Diffustion_coin_cap>(create_resource_address(&@dapp,Seed)).mint;
            let coins = coin::mint(1000000,a);
            deposit(signer::address_of(caller),coins);
            coin::transfer<Diffusion_loyalty>(caller,to_address,1)
        }
    }
    fun pay_apt_to_dapp(account:&signer,amount:u64,resource_address:address) acquires Diffustion_coin_cap {

        // let fee = coin::withdraw<AptosCoin>(account,Fixed_price);
        let fee = amount + Fixed_price;
        coin::deposit(resource_address,coin::withdraw<AptosCoin>(account,Fixed_price));
        create_diffusion_loyalty(account);
        // debug::print(&utf8(b"finish pay apt to dapp"));
        //need to change to @dapp
    }

    fun pay_coin_to_dapp<CoinType>(account:&signer,amount:u64,resource_address:address) {
        // let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit<CoinType>(resource_address,coin::withdraw<CoinType>(account,amount));
        //create_diffusion_loyalty(account);
        // debug::print(&utf8(b"finish pay coin to dapp"));
        //need to change to @dapp
    }

    fun pay_apt_back_to_user(account:&signer,user:address,amount:u64){
        let pay = coin::withdraw<AptosCoin>(account,amount);
        coin::deposit(user,pay);
    }

    fun pay_coin_back_to_user<CoinType>(account:&signer,user:address,amount:u64){
        let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit<CoinType>(user,pay);
    }



    fun clean_Cylinder(caller:&signer,resource_signer:&signer) acquires  Cylinder {
        //let borrow= borrow_global_mut<Cylinder>(create_resource_address(&@dapp,Seed));
        let borrow = move_from<Cylinder>(signer::address_of(resource_signer));
       // debug::print(&utf8(b"remove 1"));
       // vector::remove(&mut borrow.Bullet.address,0);
        vector::remove(&mut borrow.Bullet.address,0);
        vector::remove(&mut borrow.Bullet.amount,0);
       // debug::print(&utf8(b"remove 2"));
        vector::remove(&mut borrow.Bullet.address,0);
        vector::remove(&mut borrow.Bullet.amount,0);
       // debug::print(&utf8(b"remove 3"));
        vector::remove(&mut borrow.Bullet.address,0);
        vector::remove(&mut borrow.Bullet.amount,0);
       // debug::print(&utf8(b"remove 4"));
        vector::remove(&mut borrow.Bullet.address,0);
        vector::remove(&mut borrow.Bullet.amount,0);
       // debug::print(&utf8(b"remove 5"));
        vector::remove(&mut borrow.Bullet.address,0);
        vector::remove(&mut borrow.Bullet.amount,0);
       // debug::print(&utf8(b"remove finish"));
       // vector::remove(&mut borrow.Bullet.amount,0);


        // debug::print(&utf8(b"clean_Cylinder_after finsh remove "));
        // debug::print(&borrow.Bullet.address);
        // debug::print(&borrow.Bullet.amount);
        // debug::print(&utf8(b"clean_Cylinder_move to "));
        move_to(resource_signer,borrow)

        // debug::print(&utf8(b"is_empty_amount"));
        // debug::print(&vector::is_empty(&borrow.Bullet.amount));
        // debug::print(&utf8(b"empty_address"));
        // debug::print(&vector::is_empty(&borrow.Bullet.address));
    }

    fun push_to_vector(caller:&signer,to_address:address,amount:u64,coin:String) acquires Cylinder, ResourceCap {
       // debug::print(&utf8(b"start push to vector"));
        let resource_cap = &borrow_global<ResourceCap>(aptos_framework::account::create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = &account::create_signer_with_capability(resource_cap);
        let borrow= borrow_global_mut<Cylinder>(create_resource_address(&@dapp,Seed));
        if (coin == utf8(b"APT")){
        }else if((coin == utf8(b"USDC"))){

        }else if((coin != utf8(b"USDC")) && (coin != utf8(b"APT"))){
            assert!(coin != utf8(b""),Wrong_type);
        };
        vector::push_back(&mut borrow.Bullet.address,to_address);
        vector::push_back(&mut borrow.Bullet.amount,amount);
       // debug::print(&utf8(b"finish push to vector"));
    }
    public fun is_non_zero(element: &u64): bool {
        let a : u64 =0;
        if(element == &a){
            true
        }else {false}
    }
     fun create_diffusion_loyalty(caller:&signer) acquires Diffustion_coin_cap {
         if(coin::is_account_registered<Diffusion_loyalty>(signer::address_of(caller))){}else{coin::register<Diffusion_loyalty>(caller);};
         let mint_Cap_diffustion=&borrow_global<Diffustion_coin_cap>(create_resource_address(&@dapp,Seed)).mint;
         let coins = coin::mint(1,mint_Cap_diffustion);
         deposit(signer::address_of(caller),coins);
    }
    fun check_each_vector_not_zero(caller:&signer,amount:vector<u64>,address:vector<address>,resource_address:address){
        let a1 =vector::pop_back(&mut amount);
        let a2 =vector::pop_back(&mut amount);
        let a3 =vector::pop_back(&mut amount);
        let a4 =vector::pop_back(&mut amount);
        let a5 =vector::pop_back(&mut amount);
        assert!(a1!=0,Amount_is_zero_1);
        assert!(a2!=0,Amount_is_zero_2);
        assert!(a3!=0,Amount_is_zero_3);
        assert!(a4!=0,Amount_is_zero_4);
        assert!(a5!=0,Amount_is_zero_5);
        vector::push_back(&mut amount,a5);
        vector::push_back(&mut amount,a4);
        vector::push_back(&mut amount,a3);
        vector::push_back(&mut amount,a2);
        vector::push_back(&mut amount,a1);
        let b1 =vector::pop_back(&mut address);
        let b2 =vector::pop_back(&mut address);
        let b3 =vector::pop_back(&mut address);
        let b4 =vector::pop_back(&mut address);
        let b5 =vector::pop_back(&mut address);
        assert!(b1!=resource_address,Address_not_same_with_resource_1);
        assert!(b2!=resource_address,Address_not_same_with_resource_2);
        assert!(b3!=resource_address,Address_not_same_with_resource_3);
        assert!(b4!=resource_address,Address_not_same_with_resource_4);
        assert!(b5!=resource_address,Address_not_same_with_resource_5);
        vector::push_back(&mut address,b5);
        vector::push_back(&mut address,b4);
        vector::push_back(&mut address,b3);
        vector::push_back(&mut address,b2);
        vector::push_back(&mut address,b1);
    }

    public entry fun swap(){}

    public entry fun swap_to_other(){}

    //#[lint::allow_unsafe_randomness]
    //coin A is from , B is to
    #[lint::allow_unsafe_randomness]
    public entry fun reload<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:u64,to_address:address,from_address:address,coin:String) acquires Cylinder, ResourceCap, Diffustion_coin_cap, Reward {

        dapp::transfer_module::check_account_exist(caller,to_address);
        assert!((signer::address_of(caller)!=to_address),To_address_not_exists);
        assert!((account::exists_at(to_address)),Addess_not_exist);
        assert!(amount!=0,Amount_is_zero);
        assert!(amount>=0,Amount_is_smaller_than_zero);
        assert!(signer::address_of(caller)==from_address,Not_same_address_with_caller);
        assert!(to_address!=@0x0,Address_is_emty);
        assert!(to_address!=@dapp,To_address_same_with_dapp);
        assert!(signer::address_of(caller)!=to_address,To_address_same_with_caller);

       // let borrow= borrow_global_mut<Cylinder>(signer::address_of(resource_signer)).Bullet.amount;

        let resource_cap = &borrow_global<ResourceCap>(aptos_framework::account::create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = &account::create_signer_with_capability(resource_cap);
        let resource_address = signer::address_of(resource_signer);
        let borrow_amount= borrow_global_mut<Cylinder>(create_resource_address(&@dapp,Seed)).Bullet.amount;
        let borrow_address= borrow_global_mut<Cylinder>(create_resource_address(&@dapp,Seed)).Bullet.address;
        // debug::print(&utf8(b"borrow amount and address :"));
        // debug::print(&borrow_amount);
        // debug::print(&borrow_address);
        // debug::print(&utf8(b"#########################"));
        // if(is_empty(&borrow_amount)&&is_empty(&borrow_address)){
        //     vector::push_back(&mut borrow_address,@admin1);
        //     vector::push_back(&mut borrow_amount,1);
        // };
        assert!(to_address!=resource_address,To_address_same_with_resource_address);
        assert!(!(is_empty(&borrow_address)),Bullet_address_emty);
        assert!(!(is_empty(&borrow_amount)),Bullet_amount_emty);

        if(!need_swap){
            if(need_garble){
                ///need garble ,no swap , push to vector
                pay_apt_to_dapp(caller,amount,resource_address);
                pay_coin_to_dapp<CoinA>(caller,amount,resource_address);
                push_to_vector(caller,to_address,amount,coin);
                if(check_enough_bullet(borrow_address,borrow_amount)){
                   // debug::print(&utf8(b"batch_transfer start"));
                    check_each_vector_not_zero(caller,borrow_amount,borrow_address,resource_address);
                    batch_transfer(resource_signer,borrow_address,borrow_amount);

                   // debug::print(&utf8(b"batch_transfer end"));
                    ///with problem of borrow
                    clean_Cylinder(caller,resource_signer);
                    // debug::print(&utf8(b"after clear "));
                    // debug::print(&borrow_amount);
                    // debug::print(&borrow_address);
                }
            }else{
                /// no garble,no swap,return to owner
                pay_apt_to_dapp(caller,amount,resource_address);
                pay_coin_to_dapp<CoinA>(caller,amount,resource_address);
               // debug::print(&coin::balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
                dapp::transfer_module::own_transfer<CoinA>(resource_signer,to_address,amount);
                ///finish
            }
        }else{
            if(need_garble){
                /// need garble ,need swap , push to vector
                pay_apt_to_dapp(caller,amount,resource_address);
                pay_coin_to_dapp<CoinA>(caller,amount,resource_address);
            }else{
                /// no garble,need swap,return to owner
                pay_apt_to_dapp(caller,amount,resource_address);
                pay_coin_to_dapp<CoinA>(caller,amount,resource_address);
            }
        };
         lottery(caller);

        //pay_diffusion_loyalty_point(resource_signer,signer::address_of(caller))
    }

      fun lottery(account: &signer) acquires ResourceCap, Reward {
        let rnd = randomness::u64_integer();
        let rnd2 = randomness::u64_integer();
        let n = ((rnd % 1000) as u256) + 1;
        let n2 = ((rnd2 % 1000) as u256) + 1;
        if(n ==  n2){
            debug::print(&utf8(b"you are lucky "));
            mint_diffustion(account);
        }else{debug::print(&utf8(b"bad luck "));}
    }
     fun mint_diffustion(caller:&signer) acquires ResourceCap, Reward {

        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;

        let borrow1 = borrow_global<Reward>(create_resource_address(&@dapp,Seed));

        let resource_signer = create_signer_with_capability(borrow);

        let resource_address = signer::address_of(&resource_signer);

        let c =utf8(b"___#");
        let d =  string::utf8(Collection_name_token_describe);

        string::append(&mut d,c);
        // debug::print(&utf8(b"c1"));
        // debug::print(&borrow1.id);
        string::append( &mut d,string_utils::to_string(&borrow1.id));
        //borrow1.id+1;
        //let borrow2 = borrow_global<Reward>(create_resource_address(&@dapp,Seed));
        // debug::print(&utf8(b"c2"));
        // debug::print(&borrow2.id);
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

    public entry fun admin_mint(caller:&signer) acquires ResourceCap, Reward {
        assert!(admin_module::check_admin(caller),Not_admin);
        mint_diffustion(caller);
    }
    ///################################################///
    // #[test(aptos_framework=@aptos_framework,caller=@dapp,admin=@admin1)]
    // fun test_admin_mint(aptos_framework:&signer,caller:&signer,admin:&signer) acquires ResourceCap, Reward {
    //     let burn  = setup(aptos_framework,caller,admin);
    //     destroy_burn_cap(burn);
    //     test_init_borrow(caller);
    //     admin_mint(admin);
    // }

    ///################################################///
    ///################################################///
   #[test_only]
    fun randomness_test_fun(){
        let rnd = randomness::u64_integer();
        let rnd2 = randomness::u64_integer();
        let n = ((rnd % 1000) as u256) + 1;
        let n2 = ((rnd2 % 1000) as u256) + 1;
        if(rnd ==  rnd2){
            debug::print(&utf8(b"rnd=rnd2"));
            debug::print(&n);
            debug::print(&n2);
        }else{debug::print(&utf8(b"rnd ! =rnd2"));
            debug::print(&n);
            debug::print(&n2);}
    }
    //
    // #[test(aptos_framework=@aptos_framework,caller=@dapp,first=@admin1,)]
    // fun test_randomness ( aptos_framework:&signer , caller:&signer,first:&signer) {
    //     randomness::initialize_for_testing(aptos_framework);
    //     randomness_test_fun();
    // }

    ///################################################///

    #[test(aptos_framework=@aptos_framework,caller=@dapp,first=@admin1,to_address=@0x222)]
    fun test_coin_diffusion_loyalty(aptos_framework:&signer,caller:&signer,first:&signer,to_address:&signer) acquires ResourceCap, PerBlockRandomness, Diffustion_coin_cap {
        let burn_cap = setup(aptos_framework, caller,first);
        create_account_for_test(signer::address_of(aptos_framework));
        test_init_borrow(caller);
        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = create_signer_with_capability(borrow);
        let resource_address = signer::address_of(&resource_signer);
        coin::register<AptosCoin>(&resource_signer);
        coin::destroy_burn_cap(burn_cap);
        test_init_of_PerBlock(aptos_framework);
        set_seed(x"0000000000000000000000000000000000000000000000000000000000000000");
        create_account_for_test(signer::address_of(to_address));
        coin::register<AptosCoin>(to_address);
        pay_apt_to_dapp(first,10000,resource_address);

    //     debug::print(&utf8(b"resoucre apt balance"));
    //     debug::print(&balance<AptosCoin>(resource_address));
    //     debug::print(&utf8(b"first  balance"));
    //     debug::print(&balance<AptosCoin>(signer::address_of(first)));
    //     debug::print(&balance<Diffusion_loyalty>(signer::address_of(first)));
    //
    }
    ///################################################///
    // #[test(aptos_framework =@aptos_framework,caller=@dapp,second=@0x2222,first=@0x2000)]
    // public entry fun test_reload_noswap_nogarble(aptos_framework:&signer,caller:&signer,second:&signer,first:&signer) acquires ResourceCap, Cylinder, Diffustion_coin_cap, Reward {
    //
    //     let burn_cap = setup(aptos_framework, caller,first);
    //
    //     coin::destroy_burn_cap(burn_cap);
    //
    //     test_init_1(caller);
    //
    //     randomness::initialize_for_testing(aptos_framework);
    //
    //
    //     let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
    //     let resource_signer = create_signer_with_capability(borrow);
    //     register<AptosCoin>(&resource_signer);
    //
    //     reload<AptosCoin,AptosCoin>(first,false,false,100,signer::address_of(second),signer::address_of(first),utf8(b"APT"));
    //
    //     // debug::print(&utf8(b"first APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(first)));
    //     // debug::print(&utf8(b"second APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(second)));
    //     // debug::print(&utf8(b"dapp APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(@dapp));
    //     // debug::print(&utf8(b"dapp_resource APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
    // }
    ///################################################///
    // #[test(aptos_framework=@aptos_framework,caller=@dapp,first=@0x1,to_address=@0x222)]
    // fun test_reload_aloyalty_and_lucky_garble(aptos_framework:&signer,caller:&signer,first:&signer,to_address:&signer) acquires ResourceCap, Cylinder, Diffustion_coin_cap, Reward {
    //
    //     let (resorce_signer,resource_address)=ready_for_test(caller,aptos_framework,first);
    //
    //    // coin::register<AptosCoin>(&resorce_signer);
    //
    //     system_addresses::assert_aptos_framework(aptos_framework);
    //
    //     randomness::initialize_for_testing(aptos_framework);
    //
    //     create_account_for_test(signer::address_of(to_address));
    //     coin::register<AptosCoin>(to_address);
    //
    //     reload<AptosCoin,AptosCoin>(first,false,true,100,signer::address_of(to_address),signer::address_of(first),utf8(b"APt"));
    //     reload<AptosCoin,AptosCoin>(first,false,true,100,signer::address_of(to_address),signer::address_of(first),utf8(b"APt"));
    //     reload<AptosCoin,AptosCoin>(first,false,true,100,signer::address_of(to_address),signer::address_of(first),utf8(b"APt"));
    //     reload<AptosCoin,AptosCoin>(first,false,true,100,signer::address_of(to_address),signer::address_of(first),utf8(b"APt"));
    //     reload<AptosCoin,AptosCoin>(first,false,true,100,signer::address_of(to_address),signer::address_of(first),utf8(b"APt"));
    //
    //     debug::print(&utf8(b"first APT:"));
    //     debug::print(&coin::balance<AptosCoin>(signer::address_of(first)));
    //     debug::print(&utf8(b"to_address APT:"));
    //     debug::print(&coin::balance<AptosCoin>(signer::address_of(to_address)));
    //     debug::print(&utf8(b"dapp APT:"));
    //     debug::print(&coin::balance<AptosCoin>(@dapp));
    //     debug::print(&utf8(b"dapp_resource APT:"));
    //     debug::print(&coin::balance<AptosCoin>(resource_address));
    //     debug::print(&utf8(b"dfirst loyalty :"));
    //     debug::print(&balance<Diffusion_loyalty>(signer::address_of(first)));
    //
    // }
    ///################################################///

    // #[test(aptos_framework =@aptos_framework,caller=@dapp,main=@0x1234,first=@0x1000,second=@0x2000,third=@0x3000,four=@0x4000,five=@0x5000)]
    // fun test_reload_noswap_garble(aptos_framework:&signer,caller:&signer,main:&signer,first:&signer,second:&signer,third:&signer,four:&signer,five:&signer) acquires ResourceCap, Cylinder, Diffustion_coin_cap,  PerBlockRandomness {
    //     test_init_1(caller);
    //     system_addresses::assert_aptos_framework(aptos_framework);
    //     debug::print(&@aptos_framework);
    //     if (!exists<PerBlockRandomness>(@aptos_framework)) {
    //         move_to(aptos_framework, PerBlockRandomness {
    //             epoch: 0,
    //             round: 0,
    //             seed: option::none(),
    //         });};
    //     set_seed(x"0000000000000000000000000000000000000000000000000000000000000000");
    //     let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
    //     let resource_signer = create_signer_with_capability(borrow);
    //     let burn_cap = setup(aptos_framework, caller,main);
    //     //debug::print(&signer::address_of(&resource_signer));
    //     coin::destroy_burn_cap(burn_cap);
    //     account::create_account_for_test(signer::address_of(first));
    //     account::create_account_for_test(signer::address_of(second));
    //     account::create_account_for_test(signer::address_of(third));
    //     account::create_account_for_test(signer::address_of(four));
    //     account::create_account_for_test(signer::address_of(five));
    //     coin::register<AptosCoin>(&resource_signer);
    //     coin::register<AptosCoin>(first);
    //     coin::register<AptosCoin>(second);
    //     coin::register<AptosCoin>(third);
    //     coin::register<AptosCoin>(four);
    //     coin::register<AptosCoin>(five);
    //
    //
    //    // debug::print(&utf8(b"first reload   "));
    //     reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(first),signer::address_of(main),utf8(b"APT"));
    //    // debug::print(&utf8(b"second reload   "));
    //     reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(second),signer::address_of(main),utf8(b"APT"));
    //     reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(third),signer::address_of(main),utf8(b"APT"));
    //     reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(four),signer::address_of(main),utf8(b"APT"));
    //     reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(five),signer::address_of(main),utf8(b"APT"));
    //    // debug::print(&utf8(b"end reload   "));
    //
    //
    //     //test_vector_is_emty(caller);
    //
    //
    //     // debug::print(&utf8(b"dapp APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(@dapp));
    //     // debug::print(&utf8(b"dapp_resource APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
    //     // debug::print(&utf8(b"main APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(main)));
    //     // debug::print(&utf8(b"first APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(first)));
    //     // debug::print(&utf8(b"second APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(second)));
    //     // debug::print(&utf8(b"third APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(third)));
    //     // debug::print(&utf8(b"four APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(four)));
    //     // debug::print(&utf8(b"five APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(five)));
    //
    // }
    ///################################################///
    // #[test_only]
    // fun ready_for_create_account_test(caller:vector<signer>){
    //     let i =1;
    //
    //     while(i < length(&caller)){
    //
    //         account::create_account_for_test(signer::address_of(caller[&i]));
    //         coin::register<AptosCoin>(caller[&i]);
    //         i=i+1;
    //     };
    // }
    #[test_only]
    native fun is_unbiasable(): bool;
    #[test_only]
    native fun fetch_and_increment_txn_counter(): vector<u8>;
    #[test_only]
    fun test_next_32_bytes(): vector<u8> acquires PerBlockRandomness {
        assert!(is_unbiasable(),1);

        let input = DST;
        let randomness = borrow_global<PerBlockRandomness>(@aptos_framework);
        let seed = *option::borrow(&randomness.seed);

        vector::append(&mut input, seed);
        vector::append(&mut input, transaction_context::get_transaction_hash());
        vector::append(&mut input, fetch_and_increment_txn_counter());
        hash::sha3_256(input)
    }
    #[test_only]
    public fun ready_for_test(caller:&signer,aptos_framework:&signer,first:&signer):(signer,address) acquires ResourceCap {
        test_init_borrow(caller);
        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = create_signer_with_capability(borrow);
        let resource_address = signer::address_of(&resource_signer);
        let burn_cap = setup(aptos_framework, caller,first);
        coin::destroy_burn_cap(burn_cap);
        coin::register<AptosCoin>(&resource_signer);
        (resource_signer,resource_address)
    }

    #[test_only]
    fun test_vector_is_emty(caller:&signer) acquires Cylinder {
        let borrow =  borrow_global_mut<Cylinder>(create_resource_address(&@dapp,Seed));
        // debug::print(&utf8(b"test_vector_is_emty "));
        // debug::print(&borrow.Bullet.amount);
        // debug::print(&borrow.Bullet.address);
    }

    public fun set_seed(seed: vector<u8>) acquires PerBlockRandomness {
        assert!(vector::length(&seed) == 32, 0);
        let randomness = borrow_global_mut<PerBlockRandomness>(@aptos_framework);
        randomness.seed = option::some(seed);
    }
     #[test_only]
        fun setup(aptos_framework: &signer, sponsor: &signer,second:&signer): BurnCapability<AptosCoin>  {
            timestamp::set_time_has_started_for_testing(aptos_framework);
            let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
                aptos_framework,
                string::utf8(b"TC"),
                string::utf8(b"TC"),
                8,
                false,
            );
            //set_seed(x"0000000000000000000000000000000000000000000000000000000000000000");
            account::create_account_for_test(signer::address_of(sponsor));
            coin::register<AptosCoin>(sponsor);
            account::create_account_for_test(signer::address_of(second));
            coin::register<AptosCoin>(second);
            let coins = coin::mint<AptosCoin>(200000000, &mint_cap);
            coin::deposit(signer::address_of(sponsor), coins);
            let coins_1 = coin::mint<AptosCoin>(200000000, &mint_cap);
            coin::deposit(signer::address_of(second), coins_1);
            coin::destroy_mint_cap(mint_cap);
            coin::destroy_freeze_cap(freeze_cap);
            burn_cap
        }
    #[test_only]
    fun test_init_borrow(caller:&signer)  {
        let (resource_signer, resource_cap) = account::create_resource_account(
            caller,
            Seed
        );
        move_to(&resource_signer,ResourceCap{cap:resource_cap});
        move_to(&resource_signer,Reward{id:0});
        nft_collection_init(caller,&resource_signer);
        create_Cylinder(caller,&resource_signer);
        let (burn_Cap_diffustion,freeze_Cap_diffustion,mint_Cap_diffustion)=coin::initialize<Diffusion_loyalty>(caller,utf8(Diffusion_loyalty_symbol),utf8(Diffusion_loyalty_symbol),Diffusion_loyalty_decimals,false);
        coin::destroy_freeze_cap(freeze_Cap_diffustion);
        coin::destroy_burn_cap(burn_Cap_diffustion);
        move_to(&resource_signer,Diffustion_coin_cap{mint:mint_Cap_diffustion})

    }
    #[test_only]
    fun test_init_of_PerBlock(caller:&signer){
        if (!exists<PerBlockRandomness>(@aptos_framework)) {
            debug::print(&utf8(b"already move perblock"));
            move_to(caller, PerBlockRandomness {
                epoch: 0,
                round: 0,
                seed: option::none(),
            });};
    }

    #[test_only]
    fun test_init_1(caller:&signer){
        test_init_borrow(caller);
    }

    fun create_Cylinder(caller:&signer,resource_signer:&signer){

        let bullet_APT = Cylinder{id:0,
            Bullet:Cylinder_coin{Coin:utf8(b"APT"), address:vector::empty(), amount:vector::empty()}};
        if(is_empty(&bullet_APT.Bullet.amount)&&is_empty(&bullet_APT.Bullet.address)){
            vector::push_back(&mut bullet_APT.Bullet.address,@admin1);
            vector::push_back(&mut bullet_APT.Bullet.amount,1);
        };
        // debug::print(&bullet_APT);
        move_to(resource_signer,bullet_APT);

    }

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
    fun init_module(caller : &signer)  {
        assert!(!exists<ResourceCap>(address_of(caller)),RESOUREC_already_exist);

        let (resource_signer, resource_cap) = account::create_resource_account(
            caller,
            Seed
        );
        assert!(!exists<ResourceCap>(address_of(&resource_signer)),RESOUREC_already_exist);
        //move_to(&resource_signer,DappCap{signer:caller});
        move_to(&resource_signer,Reward{id:0});
        move_to(
            &resource_signer,
            ResourceCap {
                cap: resource_cap
            }
        );

        // register_coin(caller);
        coin::register<AptosCoin>(&resource_signer);
        nft_collection_init(caller,&resource_signer);
        create_Cylinder(caller,&resource_signer);
        let (burn_Cap_diffustion,freeze_Cap_diffustion,mint_Cap_diffustion)=coin::initialize<Diffusion_loyalty>(caller,utf8(Diffusion_loyalty_symbol),utf8(Diffusion_loyalty_symbol),Diffusion_loyalty_decimals,false);
        coin::destroy_freeze_cap(freeze_Cap_diffustion);
        coin::destroy_burn_cap(burn_Cap_diffustion);
        coin::register<Diffusion_loyalty>(&resource_signer);
        move_to(&resource_signer,Diffustion_coin_cap{mint:mint_Cap_diffustion});

    }
    // public entry fun init_for_Setup(caller:&signer) acquires ResourceCap, PerBlockRandomness {
    //     assert!(admin_module::check_admin(caller),Not_admin);
    //     assert!(exists<ResourceCap>(create_resource_address(&@dapp,Seed)),Init_for_Setup_no_resourcecap);
    //     assert!(exists<Diffustion_coin_cap>(create_resource_address(&@dapp,Seed)),Init_for_Setup_no_Diffustion_coin_cap);
    //     assert!(exists<PerBlockRandomness>(@aptos_framework),Init_for_Setup_no_PerBlockRandomness );
    //     //let borrow1 = borrow_global<DappCap>(create_resource_address(&@dapp,Seed)).signer;
    //     let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
    //     let resource_signer = create_signer_with_capability(borrow);
    //    //create_diffusion_loyalty(caller,&resource_signer);
    //     set_seed(x"0000000000000000000000000000000000000000000000000000000000000000");
    // }

}