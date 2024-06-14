module dapp::admin_module{
    use std::signer;
    use std::signer::address_of;
    use std::string::{String,utf8};
    use aptos_std::ristretto255_pedersen::commitment_into_point;
    use aptos_framework::account;
    use aptos_framework::account::{SignerCapability, create_resource_address, create_signer_with_capability};
    use aptos_framework::aptos_account::{transfer_coins, deposit_coins};
    use aptos_framework::aptos_coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{withdraw, balance};
    use aptos_framework::primary_fungible_store::deposit;
    use aptos_token_objects::collection;

    const Seed:vector<u8> = b"asf";
    const Not_admin:u64=12;
    const Not_enough_balance:u64=13;
    const Withdraw_Resource_address_same_with_to_address : u64 =14;

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
    fun check_admin_ability()  {
        //let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
    }
    public entry fun set_aprove_admin(caller:&signer) {
        // assert!(check_admin(caller),Not_admin);
        // let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        // move_to(caller,ResourceCap{cap:borrow});
    }

    public entry fun admin_withdraw<CoinType>(caller:&signer,amount:u64) acquires ResourceCap {
        assert!(check_admin(caller),Not_admin);
        assert!(check_balance<CoinType>(caller,amount),Not_enough_balance); //check dapp balance,if not -> end

        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;//if not admin , end
        let resource_signer = &account::create_signer_with_capability(borrow);
        if(check_balance<CoinType>(caller,amount)){
            assert!(address_of(resource_signer)!=signer::address_of(caller),Withdraw_Resource_address_same_with_to_address);
            transfer_coins<CoinType>(resource_signer,signer::address_of(caller),amount);
        };

    }

}