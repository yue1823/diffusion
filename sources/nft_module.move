 module dapp::nft_module{
//     use std::string;
//     use std::option;
//     use std::signer;
//     use std::string::{utf8, String};
//
//     use aptos_std::string_utils;
//
//     use aptos_token_objects::token;
//     use aptos_token_objects::collection;
//     use aptos_framework::account::{SignerCapability, create_resource_address, create_signer_with_capability};
//     use aptos_framework::object::{Self,Object, LinearTransferRef,DeleteRef};
//     use aptos_token_objects::aptos_token;
//     use aptos_token_objects::royalty::create;
//     use aptos_token_objects::token::Token;
//
//     use aptos_framework::account;
//
//     use aptos_framework::aptos_coin::AptosCoin;
//
//     use aptos_framework::coin;
//     use aptos_framework::coin::{register, deposit, BurnCapability, FreezeCapability, MintCapability};
//
//     // friend dapp::pay_module;
//     // friend dapp::roll;
//     #[test_only]
//     use aptos_framework::timestamp;
//
//     const Seed:vector<u8> = b"asf";
//     const Collection_name:vector<u8> =b"Diffusion";
//     const Collection_name_token_describe:vector<u8> =b"You are really lucky to get this one XD ";
//     const TokenPrefix: vector<u8> = b"mfer #";
//     const Url_nft:vector<u8> = b"https://pot-124.4everland.store/diffusion.jpeg";
//
//     const Diffusion_loyalty_name:vector<u8> = b"loyalty";
//     const Diffusion_loyalty_symbol:vector<u8> = b"diffusion point";
//     const Diffusion_loyalty_decimals:u8 = 8;
//     struct Diffustion_coin_cap has key {
//         burn:BurnCapability<Diffusion_loyalty>,
//         freeze:FreezeCapability<Diffusion_loyalty>,
//         mint:MintCapability<Diffusion_loyalty>
//     }
//
//     struct TokenRefsStore has key {
//         mutator_ref: token::MutatorRef,
//         burn_ref: token::BurnRef,
//         extend_ref: object::ExtendRef,
//         transfer_ref: option::Option<object::TransferRef>
//     }
//     struct Diffusion_loyalty has key{}
//
//     struct Reward has key {
//         id : u8,
//     }
//
//     struct CollectionRefsStore has key{
//
//         mutator_ref:collection::MutatorRef,
//
//     }
//     #[event]
//     struct Collection has store,key,drop {
//         owner:address,
//         token_id:address,
//
//     }
//     struct ResourceCap has key{
//         cap:SignerCapability
//     }
//     struct Tokenstore has key{
//         mutator_ref: token::MutatorRef,
//         burn_ref: token::BurnRef,
//         transfer_ref: option::Option<object::TransferRef>
//     }
//     #[event]
//     struct BurnEvent has drop, store {
//         owner: address,
//         token_id: address,
//
//     }
//
//     // fun mint(caller:&signer) acquires ResourceCap, Reward {
//     //
//     //     let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
//     //
//     //     let borrow1 = borrow_global<Reward>(create_resource_address(&@dapp,Seed));
//     //
//     //     let resource_signer = create_signer_with_capability(borrow);
//     //
//     //     let resource_address = signer::address_of(&resource_signer);
//     //
//     //     let c =utf8(b"___#");
//     //     let d =  string::utf8(Collection_name_token_describe);
//     //
//     //     string::append(&mut d,c);
//     //     // debug::print(&utf8(b"c1"));
//     //     // debug::print(&borrow1.id);
//     //     string::append( &mut d,string_utils::to_string(&borrow1.id));
//     //     //borrow1.id+1;
//     //     let borrow2 = borrow_global<Reward>(create_resource_address(&@dapp,Seed));
//     //     // debug::print(&utf8(b"c2"));
//     //     // debug::print(&borrow2.id);
//     //     let royalty=create(15,100,@admin1);
//     //     let token_cref = token::create(
//     //         &resource_signer,
//     //         utf8(Collection_name),
//     //         utf8(Collection_name_token_describe),
//     //         d,
//     //         option::some(royalty),
//     //         utf8(Url_nft),
//     //     );
//     //
//     //
//     //     let token_signer = object::generate_signer(&token_cref);
//     //     let token_mutator_ref = token::generate_mutator_ref(&token_cref);
//     //     let token_burn_ref = token::generate_burn_ref(&token_cref);
//     //
//     //     move_to(
//     //         &token_signer,
//     //         TokenRefsStore {
//     //             mutator_ref: token_mutator_ref,
//     //             burn_ref: token_burn_ref,
//     //             extend_ref: object::generate_extend_ref(&token_cref),
//     //             transfer_ref: option::none()
//     //         }
//     //     );
//     //
//     //     object::transfer(
//     //         &resource_signer,
//     //         object::object_from_constructor_ref<Token>(&token_cref),
//     //         signer::address_of(caller),
//     //     );
//     //
//     // }
//
//     // public(friend) fun lucky_mint(caller:&signer) acquires ResourceCap, Reward {
//     //         mint(caller);
//     // }
//
//     // public(friend) fun create_diffusion_loyalty(caller:&signer) acquires ResourceCap {
//     //     let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
//     //     let resource_signer = create_signer_with_capability(borrow);
//     //     let (burn_Cap_diffustion,freeze_Cap_diffustion,mint_Cap_diffustion)=coin::initialize<Diffusion_loyalty>(caller,utf8(Diffusion_loyalty_symbol),utf8(Diffusion_loyalty_symbol),Diffusion_loyalty_decimals,false);
//     //     let coins = coin::mint(10000000000000,&mint_Cap_diffustion);
//     //     deposit(signer::address_of(caller),coins);
//     //     move_to(&resource_signer,Diffustion_coin_cap{burn:burn_Cap_diffustion,freeze:freeze_Cap_diffustion,mint:mint_Cap_diffustion})
//     // }
//     ///################################################///
//
//     // #[test(aptos_framework=@aptos_framework,caller=@dapp,first=@0x1)]
//     // fun test_mint_nft(aptos_framework: &signer, caller: &signer,first:&signer) acquires ResourceCap, Reward {
//     //     timestamp::set_time_has_started_for_testing(aptos_framework);
//     //     let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
//     //         aptos_framework,
//     //         string::utf8(b"TC"),
//     //         string::utf8(b"TC"),
//     //         8,
//     //         false,
//     //     );
//     //     account::create_account_for_test(signer::address_of(caller));
//     //     coin::register<AptosCoin>(caller);
//     //     account::create_account_for_test(signer::address_of(first));
//     //     coin::register<AptosCoin>(first);
//     //     coin::destroy_mint_cap(mint_cap);
//     //     coin::destroy_freeze_cap(freeze_cap);
//     //     coin::destroy_burn_cap(burn_cap);
//     //     init(caller);
//     //     // mint(first);
//     //
//     // }
//
//     #[test_only]
//     fun init(caller:&signer){
//         let (resource_signer, resource_cap) = account::create_resource_account(
//             caller,
//             Seed
//         );
//         move_to(&resource_signer,ResourceCap{cap:resource_cap});
//         move_to(&resource_signer,Reward{id:0});
//         let royalty = create(10,100,@admin1);  //nft royalty
//         let collection=collection::create_unlimited_collection(             //create collection
//             &resource_signer,
//             utf8(Collection_name_token_describe),
//             utf8(Collection_name),
//             option::some(royalty),
//             utf8(Url_nft)
//         );
//         let collection_signer =  object::generate_signer(&collection);
//         let mutator_ref = aptos_token_objects::collection::generate_mutator_ref(&collection);
//         move_to(&collection_signer,
//             CollectionRefsStore{
//                 mutator_ref});
//     }
//
//
}