module dapp::admin_module{
    use std::signer;
    use std::string::{String,utf8};
    use aptos_std::ristretto255_pedersen::commitment_into_point;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::aptos_coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{withdraw, balance};
    use aptos_token_objects::collection;


    const Not_admin:u64=1;
    const Not_enough_balance:u64=2;

    struct ResourceCap has key{
        cap:SignerCapability
    }
    struct CollectionRefsStore has key{

        mutator_ref:collection::MutatorRef,

    }


    fun check_balance<CoinType>(caller:&signer,amount:u64):bool{
        if(balance<CoinType>(@dapp)>amount){
            return true
        }else{return false}
    }
    fun check_admin(caller:&signer):bool{
        if(signer::address_of(caller)==@admin1||signer::address_of(caller)==@admin2){
            return true
        }else{return false}
    }

    public entry fun admin_withdraw<CoinType>(caller:&signer,amount:u64){
        assert!(check_admin(caller),Not_admin); //if not admin , end
        assert!(check_balance<CoinType>(caller,amount),Not_enough_balance); //check dapp balance,if not -> end

        if(check_balance<CoinType>(caller,amount)){

        };

    }

}