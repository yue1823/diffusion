module dapp::pay_module{
    use std::string::{String, append, utf8};
    use dapp::test_module;
    use dapp::transfer_module;
    use std::coin;
    use std::option;
    use std::option::is_none;
    use std::signer;
    use std::signer::address_of;
    use std::vector;
    use std::vector::{length, is_empty};
    use aptos_std::big_vector::push_back;
    use aptos_std::debug;
    use aptos_std::smart_vector::clear;
    use aptos_std::table_with_length::empty;
    use aptos_framework::account;
    use aptos_framework::account::{create_resource_address, SignerCapability};
    use aptos_framework::aptos_account;
    use aptos_framework::aptos_account::{transfer_coins, batch_transfer};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{transfer, is_account_registered};
    use aptos_framework::object;
    use aptos_framework::object::{create_object_from_account, generate_signer, create_named_object};
    use aptos_token_objects::collection;

    #[test_only]
    use std::string;
    use aptos_token_objects::royalty::{create, Royalty};
    #[test_only]
    use aptos_framework::account::{create_resource_account, create_signer_with_capability, create_account_for_test};



    const Collection_name:vector<u8> = b"";
    const Description_nft:vector<u8> = b"Fist collection of our dapp (I won't sell it lower than 1 APT ^_^) ";
    const Name_nft:vector<u8> = b"";
    const Url_nft:vector<u8> = b"";
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
    const Amount_is_smaller_than_zero :u64 = 15;
    const To_address_same_with_dapp :u64 = 16;
    const To_address_same_with_resource_address :u64 = 17;
    const Bullet_amount_emty :u64 = 18;
    const Bullet_address_emty :u64 = 19;
    const To_address_same_with_caller : u64 =30;
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

    #[test_only]
    use aptos_framework::aptos_coin;
    #[test_only]
    use aptos_framework::aptos_coin::{initialize_for_test, initialize_for_test_without_aggregator_factory};
    #[test_only]
    use aptos_framework::coin::{balance, BurnCapability};
    #[test_only]
    use aptos_framework::stake::mint;

    use aptos_framework::timestamp;
    #[test_only]
    use aptos_token_objects::aptos_token::freeze_transfer;


    const Fixed_price:u64 = 10000000;

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
    fun pay_apt_to_dapp(account:&signer,amount:u64,resource_address:address){

        // let fee = coin::withdraw<AptosCoin>(account,Fixed_price);
        let fee = amount + Fixed_price;
        coin::deposit(resource_address,coin::withdraw<AptosCoin>(account,Fixed_price));
        // debug::print(&utf8(b"finish pay apt to dapp"));
        //need to change to @dapp
    }

    fun pay_coin_to_dapp<CoinType>(account:&signer,amount:u64,resource_address:address){
        // let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit<CoinType>(resource_address,coin::withdraw<CoinType>(account,amount));
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
    //coin A is from , B is to
    public entry fun reload<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:u64,to_address:address,from_address:address,coin:String) acquires Cylinder, ResourceCap {

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
                /// need garble ,no swap , push to vector
            }else{
                /// no garble,no swap,return to owner
            }
        }

    }
    ///################################################///

    #[test(aptos_framework =@aptos_framework,caller=@dapp,second=@0x2222,first=@0x2000)]
    public entry fun test_reload_noswap_nogarble(aptos_framework:&signer,caller:&signer,second:&signer,first:&signer) acquires ResourceCap, Cylinder {
        // let (resource_signer,resource_signer_cap) = create_resource_account(&dapp,Seed);
        // coin::register<AptosCoin>(&resource_signer);
        test_init_1(caller);

        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = create_signer_with_capability(borrow);

        let burn_cap = setup(aptos_framework, caller,second);
        coin::destroy_burn_cap(burn_cap);
        // account::create_account_for_test(signer::address_of(dapp));

        account::create_account_for_test(signer::address_of(first));
        coin::register<AptosCoin>(first);                   //create account for bob

        transfer_coins<AptosCoin>(caller,signer::address_of(first),200000000);

        coin::register<AptosCoin>(&resource_signer);

        let a=create_resource_address(&@dapp,Seed);


        reload<AptosCoin,AptosCoin>(first,false,false,100,signer::address_of(second),signer::address_of(first),utf8(b"APT"));
        // debug::print(&utf8(b"first APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(first)));
        // debug::print(&utf8(b"second APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(second)));
        // debug::print(&utf8(b"dapp APT:"));
        // debug::print(&coin::balance<AptosCoin>(@dapp));
        // debug::print(&utf8(b"dapp_resource APT:"));
        // debug::print(&coin::balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
    }
    ///################################################///
    #[test(aptos_framework=@aptos_framework,caller=@dapp,first=@0x1,to_address=@0x222)]
    fun test_reload_accepted_zero(aptos_framework:&signer,caller:&signer,first:&signer,to_address:&signer) acquires ResourceCap, Cylinder {
        let (resorce_signer,resource_address)=ready_for_test(caller,aptos_framework,first);

        create_account_for_test(signer::address_of(to_address));
        coin::register<AptosCoin>(to_address);
        reload<AptosCoin,AptosCoin>(first,false,true,100,signer::address_of(to_address),signer::address_of(first),utf8(b"APt"));
        // debug::print(&utf8(b"first APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(first)));
        // debug::print(&utf8(b"to_address APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(to_address)));
        // debug::print(&utf8(b"dapp APT:"));
        // debug::print(&coin::balance<AptosCoin>(@dapp));
        // debug::print(&utf8(b"dapp_resource APT:"));
        // debug::print(&coin::balance<AptosCoin>(resource_address));

    }
    ///################################################///

    #[test(aptos_framework =@aptos_framework,caller=@dapp,main=@0x1234,first=@0x1000,second=@0x2000,third=@0x3000,four=@0x4000,five=@0x5000)]
    fun test_reload_noswap_garble(aptos_framework:&signer,caller:&signer,main:&signer,first:&signer,second:&signer,third:&signer,four:&signer,five:&signer) acquires ResourceCap, Cylinder {
        test_init_1(caller);
        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = create_signer_with_capability(borrow);
        let burn_cap = setup(aptos_framework, caller,main);
        debug::print(&signer::address_of(&resource_signer));
        coin::destroy_burn_cap(burn_cap);
        account::create_account_for_test(signer::address_of(first));
        account::create_account_for_test(signer::address_of(second));
        account::create_account_for_test(signer::address_of(third));
        account::create_account_for_test(signer::address_of(four));
        account::create_account_for_test(signer::address_of(five));
        coin::register<AptosCoin>(&resource_signer);
        coin::register<AptosCoin>(first);
        coin::register<AptosCoin>(second);
        coin::register<AptosCoin>(third);
        coin::register<AptosCoin>(four);
        coin::register<AptosCoin>(five);


       // debug::print(&utf8(b"first reload   "));
        reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(first),signer::address_of(main),utf8(b"APT"));
       // debug::print(&utf8(b"second reload   "));
        reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(second),signer::address_of(main),utf8(b"APT"));
        reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(third),signer::address_of(main),utf8(b"APT"));
        reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(four),signer::address_of(main),utf8(b"APT"));
        reload<AptosCoin,AptosCoin>(main,false,true,1000,signer::address_of(five),signer::address_of(main),utf8(b"APT"));
       // debug::print(&utf8(b"end reload   "));


        //test_vector_is_emty(caller);


        // debug::print(&utf8(b"dapp APT:"));
        // debug::print(&coin::balance<AptosCoin>(@dapp));
        // debug::print(&utf8(b"dapp_resource APT:"));
        // debug::print(&coin::balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
        // debug::print(&utf8(b"main APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(main)));
        // debug::print(&utf8(b"first APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(first)));
        // debug::print(&utf8(b"second APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(second)));
        // debug::print(&utf8(b"third APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(third)));
        // debug::print(&utf8(b"four APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(four)));
        // debug::print(&utf8(b"five APT:"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(five)));

    }
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
    public fun ready_for_test(caller:&signer,aptos_framework:&signer,first:&signer):(signer,address) acquires ResourceCap {
        test_init_1(caller);
        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = create_signer_with_capability(borrow);
        let resource_address = signer::address_of(&resource_signer);
        coin::register<AptosCoin>(&resource_signer);
        let burn_cap = setup(aptos_framework, caller,first);
        coin::destroy_burn_cap(burn_cap);
        (resource_signer,resource_address)
    }

    #[test_only]
    fun test_vector_is_emty(caller:&signer) acquires Cylinder {
        let borrow =  borrow_global_mut<Cylinder>(create_resource_address(&@dapp,Seed));
        // debug::print(&utf8(b"test_vector_is_emty "));
        // debug::print(&borrow.Bullet.amount);
        // debug::print(&borrow.Bullet.address);
    }


     #[test_only]
        fun setup(aptos_framework: &signer, sponsor: &signer,second:&signer): BurnCapability<AptosCoin> {
            timestamp::set_time_has_started_for_testing(aptos_framework);
            let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
                aptos_framework,
                string::utf8(b"TC"),
                string::utf8(b"TC"),
                8,
                false,
            );
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
        nft_collection_init(caller,&resource_signer);
        create_Cylinder(caller,&resource_signer);
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

        let royalty = create(10,100,@admin1);  //nft royalty
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
    fun init_module(caller : &signer){
        assert!(!exists<ResourceCap>(address_of(caller)),RESOUREC_already_exist);
        let (resource_signer, resource_cap) = account::create_resource_account(
            caller,
            Seed
        );
        assert!(!exists<ResourceCap>(address_of(&resource_signer)),RESOUREC_already_exist);
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
    }

}