module 0x6::pay_module{
    use std::string::{String, append, utf8};
    use 0x6::test_module;
    use std::coin;
    use std::signer;
    use std::vector;
    use std::vector::length;
    use aptos_std::big_vector::push_back;
    use aptos_std::debug;
    use aptos_std::table_with_length::empty;
    use aptos_framework::account;
    use aptos_framework::account::create_resource_address;
    use aptos_framework::aptos_account;
    use aptos_framework::aptos_account::transfer_coins;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::transfer;
    use aptos_framework::object;
    use aptos_framework::object::{create_object_from_account, generate_signer, create_named_object};
    #[test_only]
    use std::string;

    #[test_only]
    use aptos_framework::account::create_resource_account;

    friend 0x6::init_module;


    const Seed:vector<u8> = b"asf";
    const Wrong_type:u64 = 1;


    #[test_only]
    use aptos_framework::aptos_coin;
    #[test_only]
    use aptos_framework::aptos_coin::initialize_for_test;
    #[test_only]
    use aptos_framework::coin::{balance, BurnCapability};
    #[test_only]
    use aptos_framework::stake::mint;
    #[test_only]
    use aptos_framework::timestamp;

    const Fixed_price:u64 = 1000000;

    struct Address_list has drop,store{
        list:address
    }
    struct Amount_list has drop,store{
        list:u64
    }
    struct Cylinder_coin has key,store{
        Coin:String,
        address:vector<Address_list>,
        amount:vector<Amount_list>
    }

    struct Cylinder has key,store{
        id:u8,
        Bullet:Cylinder_coin
    }

    fun create_address_list(address:address):Address_list{
        Address_list{list:address}
    }
    fun create_amount_list(amount:u64):Amount_list{
        Amount_list{list:amount}
    }


    fun pay_apt_to_dapp(account:&signer,to_address:&signer){

        let pay = coin::withdraw<AptosCoin>(account,Fixed_price);
        coin::deposit(signer::address_of(to_address),pay);
    }

    fun pay_coin_to_dapp<CoinType>(account:&signer,amount:u64,to_address:&signer){

        let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit<CoinType>(signer::address_of(to_address),pay);
    }

    fun pay_apt_back_to_user(account:&signer,user:address,amount:u64){
        let pay = coin::withdraw<AptosCoin>(account,amount);
        coin::deposit(user,pay);
    }

    fun pay_coin_back_to_user<CoinType>(account:&signer,user:address,amount:u64){
        let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit<CoinType>(user,pay);
    }

    public(friend) fun create_Cylinder(caller:&signer){

        let a=create_resource_address(&@dapp,Seed);
        let  cylinder_object_ConstructorRef = create_named_object(caller,Seed);
        let  cylinder_object_signer = generate_signer(&cylinder_object_ConstructorRef);
        let bullet_APT = Cylinder{id:0,
            Bullet:Cylinder_coin{Coin:utf8(b"APT"), address:vector::empty(), amount:vector::empty()}};
        move_to(caller,bullet_APT);
    }

    fun push_to_vector(caller:&signer,to_address:address,amount:u64,coin:String)acquires  Cylinder{

        let borrow= borrow_global_mut<Cylinder>(create_resource_address(&@dapp,Seed));
        if (coin == utf8(b"APT")){

        }else if((coin == utf8(b"USDC"))){

        }else if((coin != utf8(b"USDC")) && (coin != utf8(b"APT"))){
            assert!(coin == utf8(b""),Wrong_type);

        };
        let a = create_address_list(to_address);
        let b = create_amount_list(amount);
        vector::push_back(&mut borrow.Bullet.address,a);
        vector::push_back(&mut borrow.Bullet.amount,b);

    }
    fun check_enough_bullet(){
        // length(&Bullet_1.Bullet.address);
    }
    public entry fun swap(){}

    public entry fun swap_to_other(){}
    //coin A is from , B is to
    public entry fun reload<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:u64,to_address:&signer,from_address:address,coin:String) acquires Cylinder {
        if(!need_swap){
            if(need_garble){
                ///need garble ,no swap , push to vector
                push_to_vector(caller,signer::address_of(to_address),amount,coin);
            }else{
                /// no garble,no swap,return to owner

                pay_apt_to_dapp(caller,to_address);
                0x6::transfer_module::own_transfer<CoinA>(caller,signer::address_of(to_address),amount);

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

    struct CoinA has store, key {}
    struct CoinB has store, key {}

    #[test(aptos_framework = @0x1,caller=@0x123,second=@0x2222,dapp=@0x333)]
    public entry fun test_reload(aptos_framework:signer,caller:signer,second:signer,dapp:signer) acquires Cylinder {
        let burn_cap = setup(&aptos_framework, &caller,&second);
        coin::destroy_burn_cap(burn_cap);
        account::create_account_for_test(signer::address_of(&dapp));
        coin::register<AptosCoin>(&dapp);
        let a=create_resource_address(&@dapp,Seed);
        let (resource_signer,resource_signer_cap) = create_resource_account(&dapp,Seed);
        coin::register<AptosCoin>(&resource_signer);

        reload<AptosCoin,CoinB>(&caller,false,false,100,&second,signer::address_of(&caller),utf8(b"APT"));
        debug::print(&coin::balance<AptosCoin>(signer::address_of(&caller)));
        debug::print(&coin::balance<AptosCoin>(signer::address_of(&second)));
    }

    /// #[test(admin=@0x123)]
    /// public entry fun account_test_1(admin:signer){
    ///     let address=account::create_account_for_test(signer::address_of(&admin));
    ///     let (apt_burn,apt_mint)=initialize_for_test(&address);
    ///     move_to(&address,apt_mint);
    ///     aptos_coin::mint(&address,signer::address_of(&address),100000);
    ///     balance<AptosCoin>(signer::address_of(&address));
    ///     pay_apt_to_dapp(&admin);
    ///     balance<AptosCoin>(signer::address_of(&address));
    ///
    /// }
}