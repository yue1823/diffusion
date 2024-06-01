module 0x6::pay_module{
    use std::string::{String, append};
    use std::coin;
    use aptos_std::big_vector::push_back;
    use aptos_framework::account;
    use aptos_framework::aptos_account;
    use aptos_framework::aptos_coin::AptosCoin;

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
    const Bullet_1:Cylinder = Cylinder{id:0, Bullet:Cylinder_coin{ Coin:b"APT", address:vector[@dapp], amount:vector[0]}};
    struct Cylinder_coin has key{
        Coin:String,
        address:vector<address>,
        amount:vector<u64>
    }

    struct Cylinder has key{
        id:u8,
        Bullet:Cylinder_coin
    }

    fun pay_apt_to_dapp(account:&signer){
        let pay = coin::withdraw<AptosCoin>(account,Fixed_price);
        coin::deposit(@dapp,pay);
    }

    fun pay_coin_to_dapp<CoinType>(account:&signer,amount:u64){
        let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit(@dapp,pay);
    }

    fun pay_apt_back_to_user(account:&signer,user:address,amount:u64){
        let pay = coin::withdraw<AptosCoin>(account,amount);
        coin::deposit(user,pay);
    }

    fun pay_coin_back_to_user<CoinType>(account:&signer,user:address,amount:u64){
        let pay = coin::withdraw<CoinType>(account,amount);
        coin::deposit(user,pay);
    }

    fun push_to_vector(to_address:address,amount:u64){
        push_back( &mut Bullet_1.Bullet.address,to_address);
        push_back(&mut Bullet_1.Bullet.amount,amount)
    }
    public entry fun swap(){}

    public entry fun swap_to_other(){}

    public entry fun reload<CoinA,CoinB>(need_swap:bool,need_garble:bool,amount:u64,to_address:address,from_address:address){
        if(!need_swap){
            if(need_garble){
                ///need garble ,no swap , push to vector
            }else{
                /// no garble,no swap,return to owner
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