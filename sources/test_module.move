module dapp::test_module{
    use std::option;
    use std::signer;
    use std::string;
    use std::string::{String,utf8};
    use std::vector;
    use aptos_std::debug;
    use aptos_framework::account;
    use aptos_framework::account::create_resource_address;
    use aptos_framework::coin;

    use aptos_framework::coin::Coin;
    use aptos_framework::object;
    use aptos_framework::resource_account::{create_resource_account, create_resource_account_and_fund};
    use aptos_token_objects::collection::MutatorRef;
    use aptos_token_objects::collection;
    use aptos_token_objects::royalty::{create, Royalty};
    use aptos_framework::account::SignerCapability;
    use aptos_framework::object::{generate_signer, create_named_object};
    use dapp::pay_module;
    #[test_only]
    use std::features::get_resource_groups_feature;
    #[test_only]
    use aptos_framework::account::create_signer_with_capability;


    const Collection_name:vector<u8> = b"";
    const Description_nft:vector<u8> = b"Fist collection of our dapp (I won't sell it lower than 1 APT ^_^) ";
    const Name_nft:vector<u8> = b"";
    const Url_nft:vector<u8> = b"";


    #[test_only]
    use aptos_framework::aptos_account;
    #[test_only]
    use aptos_framework::aptos_coin::AptosCoin;

    #[test_only]
    use aptos_framework::coin::{BurnCapability, balance};

    #[test_only]
    use aptos_framework::timestamp;
    #[test_only]
    use dapp::pay_module::{reload};

    const Seed:vector<u8> = b"asf";

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

    // #[test_only]
    // fun setup(aptos_framework: &signer, sponsor: &signer,second:&signer): BurnCapability<AptosCoin> {
    //     timestamp::set_time_has_started_for_testing(aptos_framework);
    //
    //     let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
    //         aptos_framework,
    //         string::utf8(b"TC"),
    //         string::utf8(b"TC"),
    //         8,
    //         false,
    //     );
    //     account::create_account_for_test(signer::address_of(sponsor));
    //     coin::register<AptosCoin>(sponsor);
    //     account::create_account_for_test(signer::address_of(second));
    //     coin::register<AptosCoin>(second);
    //     let coins = coin::mint<AptosCoin>(2000, &mint_cap);
    //     coin::deposit(signer::address_of(sponsor), coins);
    //     let coins_1 = coin::mint<AptosCoin>(2000, &mint_cap);
    //     coin::deposit(signer::address_of(second), coins_1);
    //     coin::destroy_mint_cap(mint_cap);
    //     coin::destroy_freeze_cap(freeze_cap);
    //
    //     burn_cap
    // }

    // #[test(aptos_framework = @0x1, sponsor = @0x123,second=@0x2222)]
    // public entry fun test_claim_coins(
    //     aptos_framework: &signer, sponsor: &signer , second:&signer){
    //     let burn_cap = setup(aptos_framework, sponsor,second);
    //     debug::print(&coin::balance<AptosCoin>(signer::address_of(sponsor)));
    //     debug::print(&coin::balance<AptosCoin>(signer::address_of(second)));
    //     coin::destroy_burn_cap(burn_cap);
    // }


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

    // struct CoinA has store, key {}
    // struct CoinB has store, key {}

    // #[test(aptos_framework =@aptos_framework,caller=@dapp,second=@0x2222)]
    // public entry fun test_reload(aptos_framework:&signer,caller:&signer,second:&signer) acquires  ResourceCap {
    //     // let (resource_signer,resource_signer_cap) = create_resource_account(&dapp,Seed);
    //     // coin::register<AptosCoin>(&resource_signer);
    //     test_init_1(caller);
    //
    //     debug::print(&utf8(b"test_reload_borrow_resource_address_of"));
    //     debug::print(&(create_resource_address(&@dapp,Seed)));
    //
    //     let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
    //     let resource_signer = create_signer_with_capability(borrow);
    //
    //     let burn_cap = setup(aptos_framework, caller,second);
    //     coin::destroy_burn_cap(burn_cap);
    //     // account::create_account_for_test(signer::address_of(dapp));
    //     // coin::register<AptosCoin>(dapp);
    //
    //     let a=create_resource_address(&@dapp,Seed);
    //
    //
    //     reload<AptosCoin,CoinB>(caller,false,false,100,signer::address_of(second),signer::address_of(caller),utf8(b"APT"));
    //     debug::print(&utf8(b"caller APT:"));
    //     debug::print(&coin::balance<AptosCoin>(signer::address_of(caller)));
    //     debug::print(&utf8(b"second APT:"));
    //     debug::print(&coin::balance<AptosCoin>(signer::address_of(second)));
    //     // debug::print(&utf8(b"dapp APT:"));
    //     // debug::print(&coin::balance<AptosCoin>(signer::address_of(dapp)));
    //     debug::print(&utf8(b"dapp_resource APT:"));
    //     debug::print(&coin::balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // #[test(aptos_framework = @aptos_framework,caller=@0x123,second=@0x2222,dapp=@0x333)]
    // public entry  fun test_reload_need_garble(aptos_framework:signer,caller:signer,second:signer,dapp:signer){
    //     let burn_cap = setup(&aptos_framework, &caller,&second);
    //     coin::destroy_burn_cap(burn_cap);
    // }
///////////////////////////////////////////////////////////////////////////////////////////////
//     #[test(caller = @dapp,aptos_framework = @aptos_framework)]
//     fun test_init(caller:&signer,aptos_framework :&signer) acquires ResourceCap {
//         test_init_1(caller);
//         //init_for_test(&caller,aptos_framework);
//         let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
//     }


///////////////////////////////////////////////////////////////////////////////////////////////
//     #[test_only]
//     fun test_init_borrow(caller:&signer)  {
//         let (resource_signer, resource_cap) = account::create_resource_account(
//             caller,
//             Seed
//         );
//         move_to(&resource_signer,ResourceCap{cap:resource_cap});
//         nft_collection_init(caller,&resource_signer);
//         create_Cylinder(caller,&resource_signer);
//     }
//     #[test_only]
//     fun test_init_1(caller:&signer){
//        test_init_borrow(caller);
//     }
//     #[test_only]
//      fun create_Cylinder(caller:&signer,resource_signer:&signer){
//
//         let bullet_APT = Cylinder{id:0,
//             Bullet:Cylinder_coin{Coin:utf8(b"APT"), address:vector::empty(), amount:vector::empty()}};
//         // debug::print(&bullet_APT);
//         move_to(resource_signer,bullet_APT);
//
//     }
//     #[test_only]
//     fun nft_collection_init(caller:&signer,resource_signer:&signer){
//
//         let royalty = create(10,100,@admin1);  //nft royalty
//         let collection=collection::create_unlimited_collection(             //create collection
//             resource_signer,
//             utf8(Description_nft),
//             utf8(Name_nft),
//             option::some(royalty),
//             utf8( Url_nft)
//         );
//         let collection_signer =  object::generate_signer(&collection);
//         let mutator_ref = aptos_token_objects::collection::generate_mutator_ref(&collection);
//         move_to(&collection_signer,
//             CollectionRefsStore{
//                 mutator_ref});
//     }

   //  #[test(caller=@dapp)]
   // public entry  fun test_borrow_init(caller:&signer) acquires ResourceCap {
   //      test_init_1(caller);
   //      test_borrow();
   //  }
   //
   //  #[test_only]
   //  fun test_borrow() acquires ResourceCap {
   //
   //      // let resource_cap = borrow_global<ResourceCap>( account::create_resource_address(&@dapp,Seed)).cap;
   //      // let resource_signer = create_signer_with_capability(&resource_cap);
   //      let resource_cap = &borrow_global<ResourceCap>(
   //          account::create_resource_address(
   //              &@dapp,
   //              Seed
   //          )
   //      ).cap;
   //
   //      let resource_signer = &account::create_signer_with_capability(
   //          resource_cap
   //      );
   //
   //      debug::print(resource_signer);
   //  }

    // #[test_only]
    // fun init_for_test(sender: &signer, fx: &signer) {
    //     dapp::init_module::init(sender);
    //     //let feature = features::get_concurrent_assets_feature();
    //     let feature = get_resource_groups_feature();
    //     let agg_feature = features::get_aggregator_v2_api_feature();
    //     let auid_feature = features::get_auids();
    //     let module_event_feature = features::get_module_event_feature();
    //     features::change_feature_flags(fx, vector[feature,auid_feature, module_event_feature], vector[ agg_feature]);
    // }

}