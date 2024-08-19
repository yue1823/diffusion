// module dapp::gamble {
//     use std::option;
//     use std::signer;
//     use std::string;
//     use std::string::String;
//     use std::vector;
//     use std::vector::push_back;
//     use aptos_framework::account::{create_resource_address, SignerCapability, create_signer_with_capability};
//     use aptos_framework::coin::transfer;
//     use aptos_framework::resource_account::create_resource_account;
//
//
//     const Seed:vector<u8> = b"asf";
//
//     //error state
//     const Not_admin:u8=1;
//     const Not_same_pair:u8 = 2;
//     const Not_same_address :u8 =3 ;
//     //error state
//     struct Account_tree has key {
//         save_1:Profile ,
//         save_2:vector<Bet_card>
//     }
//     struct Profile has key{
//         name:string::String,
//         account_address:address,
//         icon:string::String,
//         account_Amount:u64
//     }
//     struct Pair has drop,store{
//         pair_name:string::String,
//         left:u64,
//         middle:u64,
//         right:u64,
//         expired_time:u64
//     }
//     struct Bet_card has key {
//         account:address,
//         which:u8,
//         pair:Pair,
//         bet:u64,
//         a_win:u64,
//         b_win:u64,
//         c_win:u64,
//         time:u64
//     }
//     struct ResourceCap has key{
//         cap:SignerCapability
//     }
//
//     struct Pair_result_store has key {
//         save_result:vector<u8>,
//         save_pair:vector<Pair>
//     }
//     struct Diffusion_coin has key {}
//
//     //logic fun ///
//     fun check_is_same_address(caller : &signer , bet_card_address:address,user_address:address) acquires ResourceCap {
//         let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
//         let resource_signer  = create_signer_with_capability(&borrow.cap);
//         assert!((bet_card_address==user_address),Not_same_address);
//     }
//
//     fun check_pair_right(caller:&signer,pair:Pair,index:u64) acquires ResourceCap, Pair_result_store {
//         let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
//         let resource_signer  = create_signer_with_capability(&borrow.cap);
//
//         let borrow_resource_pair_result_store = borrow_global_mut<Pair_result_store>(create_resource_address(&@dapp,Seed));
//         let borrow_specific_pair = vector::borrow(&borrow_resource_pair_result_store.save_pair,index);
//         assert!((borrow_specific_pair.pair_name==pair.pair_name),Not_same_pair);
//
//     }
//
//     fun check_which_index(caller:&signer,pair_name:String) :u64 acquires Pair_result_store {
//         let borrow = borrow_global_mut<Pair_result_store>(signer::address_of(caller));
//         let length = vector::length(&borrow.save_pair);
//         let  i = 1 ;
//         while ( i <length){
//             let pair_ref = vector::borrow(&borrow.save_pair,i);
//             if(pair_ref.pair_name == pair_name){
//                 return i
//             };
//             i=i+1
//         };
//         return
//     }
//
//     fun check_is_the_right_card(caller:&signer,pair_reult:&Pair_result_store,user_card:&Bet_card) acquires ResourceCap, Pair_result_store {
//         let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
//         let resource_signer  = create_signer_with_capability(&borrow.cap);
//         let index = check_which_index(&resource_signer,user_card.pair.pair_name);
//         check_pair_right(&resource_signer,user_card.pair,index);
//         assert!((signer::address_of(caller) != user_card.account),Not_same_address);
//         check_is_same_address(&resource_signer,user_card.account,signer::address_of(caller));
//     }
//     //logic fun ////
//
//     //init fun ////
//
//     fun init_module(caller :&signer ) acquires ResourceCap {
//         let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
//         let resource_signer  = create_signer_with_capability(&borrow.cap);
//
//         move_to(&resource_signer,
//                     Pair_result_store{save_result:vector::empty<u8>(),
//                                       save_pair:vector::empty<Pair>()
//                                       }
//         );
//
//
//     }
//     // init fun ///
//
//
//     //admin fun///
//     public entry fun create_pair(caller:&signer,pair_name:string::String,left_ratio:u64,middle_ratio:u64,right_ratio:u64,time:u64) acquires ResourceCap, Pair_result_store {
//         assert!(signer::address_of(caller)==@admin,Not_admin); //admin check
//         let borrorw = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
//         let resources_signer = create_signer_with_capability(&borrorw.cap);
//         let new_pair = Pair{pair_name,left:left_ratio,middle:middle_ratio,right:right_ratio,expired_time:time};
//         let borrow_resource_pair_store = borrow_global_mut<Pair_result_store>(create_resource_address(&@dapp,Seed));
//         push_back(&mut borrow_resource_pair_store.save_result,9);
//         push_back(&mut borrow_resource_pair_store.save_pair,new_pair);
//     }
//     public entry  fun upload_result(caller:&signer,pair_name1:string::String,result1:u8,pair1:Pair) acquires ResourceCap, Pair_result_store {
//         assert!(signer::address_of(caller)==@admin,Not_admin);
//         let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
//         let resources_signer = create_signer_with_capability(&borrow.cap);
//         //move_to(&resources_signer,Pair_result_store{result:result1,save_pair:pair1});
//         let borrow_resource_pair_result_store = borrow_global_mut<Pair_result_store>(create_resource_address(&@dapp,Seed));
//         let index = check_which_index(caller,pair_name1);
//         let borrow_specific_pair = vector::borrow(&borrow_resource_pair_result_store.save_pair,index);
//         let borrow_specific_pair_result = vector::borrow(&borrow_resource_pair_result_store.save_result,index);
//
//     }
//     //admin fun///
//     //user fun /////
//     public fun create_bet_card(caller:&signer,bet1:u64,time1:u64,which1:u8) acquires Pair {
//
//         let a = borrow_global<Pair>(create_resource_address(&@dapp,Seed));
//         let left_win = bet1 * a.left ;
//         let middle_win = bet1 * a.middle;
//         let right_win = bet1 * a.right;
//         let card_1 = Bet_card{account:signer::address_of(caller),
//                         which:which1,
//                         pair:Pair{pair_name:a.pair_name,
//                                    left:a.left,
//                                     middle:a.middle,
//                                     right:a.right,
//                                     expired_time:a.expired_time},
//                         bet:bet1,
//                         a_win:left_win,
//                         b_win:middle_win,
//                         c_win:right_win,
//                         time:time1};
//
//         move_to(caller,card_1);
//     }
//
//     public fun claim_reward(caller :&signer) acquires Pair_result_store, Bet_card {
//         let borrow = borrow_global<Pair_result_store>(create_resource_address(&@dapp,Seed));
//         let user_card =  borrow_global<Bet_card>(signer::address_of(caller));
//
//     }
//     //user fun /////
//
//
//
// }
