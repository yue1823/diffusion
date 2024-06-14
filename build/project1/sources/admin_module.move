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
    use dapp::pay_module;
    #[test_only]
    use std::string;
    #[test_only]
    use aptos_std::debug;
    #[test_only]
    use aptos_framework::coin;
    #[test_only]
    use aptos_framework::coin::transfer;
    #[test_only]
    use aptos_framework::timestamp;

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
        if(balance<CoinType>(create_resource_address(&@dapp,Seed))>amount){
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

    ///################################################///

   #[test(aptos_framework=@aptos_framework,caller=@dapp,first=@0x1,admin=@admin1,not_admin=@0x11111)]
    fun test_admin_withdraw(aptos_framework:&signer,caller:&signer,first:&signer,admin:&signer,not_admin:&signer) acquires ResourceCap {
        timestamp::set_time_has_started_for_testing(aptos_framework);
        test_init(caller);
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
            aptos_framework,
            string::utf8(b"TC"),
            string::utf8(b"TC"),
            8,
            false,
        );
        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = create_signer_with_capability(borrow);
        let resource_address = signer::address_of(&resource_signer);
        account::create_account_for_test(signer::address_of(admin));
        coin::register<AptosCoin>(admin);
        account::create_account_for_test(signer::address_of(&resource_signer));
        coin::register<AptosCoin>(&resource_signer);
        account::create_account_for_test(signer::address_of(caller));
        coin::register<AptosCoin>(caller);
        account::create_account_for_test(signer::address_of(first));
        coin::register<AptosCoin>(first);
        coin::deposit(signer::address_of(first), coin::mint<AptosCoin>(200000000, &mint_cap));  //20 apt
        coin::destroy_freeze_cap(freeze_cap);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);

        transfer<AptosCoin>(first,resource_address,100000000);


        debug::print(&utf8(b"Resource_address balance : "));
        debug::print(&balance<AptosCoin>(resource_address));
        debug::print(&utf8(b"dapp_address balance : "));
        debug::print(&balance<AptosCoin>(signer::address_of(caller)));
        debug::print(&utf8(b"first_address balance : "));
        debug::print(&balance<AptosCoin>(signer::address_of(first)));
        debug::print(&utf8(b"admin_address balance : "));
        debug::print(&balance<AptosCoin>(signer::address_of(admin)));
        debug::print(&utf8(b"############After withdraw ###########"));

        admin_withdraw<AptosCoin>(admin,50000000);
        debug::print(&utf8(b"######################################"));

        debug::print(&utf8(b"Resource_address balance : "));
        debug::print(&balance<AptosCoin>(resource_address));
        debug::print(&utf8(b"dapp_address balance : "));
        debug::print(&balance<AptosCoin>(signer::address_of(caller)));
        debug::print(&utf8(b"first_address balance : "));
        debug::print(&balance<AptosCoin>(signer::address_of(first)));
        debug::print(&utf8(b"admin_address balance : "));
        debug::print(&balance<AptosCoin>(signer::address_of(admin)));
        //admin_withdraw<AptosCoin>(not_admin,1000000);
    }


    ///################################################///
    #[test_only]
    fun test_init(caller:&signer)  {
        let (resource_signer, resource_cap) = account::create_resource_account(
            caller,
            Seed
        );
        move_to(&resource_signer,ResourceCap{cap:resource_cap});
    }



}