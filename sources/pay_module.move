module 0x6::pay_module{
    use std::string::{String, append, utf8};
    use std::coin;
    use std::vector;
    use std::vector::length;
    use aptos_std::big_vector::push_back;
    use aptos_std::table_with_length::empty;
    use aptos_framework::account;
    use aptos_framework::aptos_account;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::object::{create_object_from_account, generate_signer, create_named_object};
    const Seed:vector<u8>=utf8(b"");

    #[test_only]
    use std::signer;
    #[test_only]
    use aptos_framework::aptos_account;
    #[test_only]
    use aptos_framework::aptos_coin;
    #[test_only]
    use aptos_framework::aptos_coin::initialize_for_test;
    #[test_only]
    use aptos_framework::coin::balance;
    #[test_only]
    use aptos_framework::stake::mint;

    const Fixed_price:u64 = 1000000;

    struct Cylinder_coin has key{
        Coin:String,
        address:vector<address>,
        amount:vector<u64>
    }

    struct Cylinder has key{
        id:u8,
        Bullet:Cylinder_coin
    }

    fun create_Cylinder(caller:&signer){
        create_named_object(caller,)
        let  Cylinder_object_ConstructorRef = create_object_from_account(caller);
        let  Cylinder_object_signer = generate_signer(&Cylinder_object_ConstructorRef);
        let bullet_APT = Cylinder{id:0,Bullet:Cylinder_coin{Coin:utf8(b"APT"), address:vector::empty(), amount:vector::empty()}};
        let bullet_USDC = Cylinder{id:1,Bullet:Cylinder_coin{Coin:utf8(b"USDC"), address:vector::empty(), amount:vector::empty()}};
        move_to(&Cylinder_object_signer,bullet_APT);
        move_to(&Cylinder_object_signer,bullet_USDC);
    }

    fun pay_apt_to_dapp(account:&signer){
        let pay = coin::withdraw<AptosCoin>(account,Fixed_price);
        coin::deposit(@dapp,pay);
    }

    fun pay_coin_to_dapp<CoinType>(account:&signer,amount:u64){
        let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit<CoinType>(@dapp,pay);
    }

    fun pay_apt_back_to_user(account:&signer,user:address,amount:u64){
        let pay = coin::withdraw<AptosCoin>(account,amount);
        coin::deposit(user,pay);
    }

    fun pay_coin_back_to_user<CoinType>(account:&signer,user:address,amount:u64){
        let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit<CoinType>(user,pay);
    }

    fun push_to_vector(to_address:address,amount:u64){

        push_back( &mut Bullet_1.Bullet.address,to_address);
        push_back(&mut Bullet_1.Bullet.amount,amount)
    }
    fun check_enough_bullet(){
        length(&Bullet_1.Bullet.address);
    }
    public entry fun swap(){}

    public entry fun swap_to_other(){}

    public entry fun reload<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:u64,to_address:address,from_address:address){
        if(!need_swap){
            if(need_garble){
                ///need garble ,no swap , push to vector
            }else{
                /// no garble,no swap,return to owner
                pay_apt_to_dapp(caller);
                push_to_vector(to_address,amount);
            }
        }else{
            if(need_garble){
                /// need garble ,no swap , push to vector
            }else{
                /// no garble,no swap,return to owner
            }
        }

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