module dapp::helper {

    use std::bit_vector;
    use std::signer;
    use std::string;
    use std::vector;
    use std::option;
    use aptos_framework::account;

    use aptos_framework::account::{create_resource_address, SignerCapability, create_signer_with_capability, exists_at};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use aptos_framework::coin::{register, transfer, balance, MintCapability, withdraw, deposit};

    use aptos_framework::timestamp;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_framework::object;
    use std::string::{String, utf8};
    use std::vector::{push_back, is_empty};
    use aptos_std::big_vector;
    use aptos_std::debug;
    use aptos_std::smart_vector;
    use aptos_std::string_utils;
    use aptos_std::type_info;


    use aptos_framework::aptos_account;
    use aptos_framework::aptos_account::{batch_transfer, batch_transfer_coins, assert_account_exists, transfer_coins};
    use aptos_framework::object::{Object, is_owner};
    use aptos_framework::randomness;

    use aptos_framework::resource_account::retrieve_resource_account_cap;
    use aptos_token_objects::aptos_token;
    use aptos_token_objects::collection::create_unlimited_collection;
    use aptos_token_objects::royalty;
    use aptos_token_objects::royalty::create;

    use aptos_token_objects::token::{Token, burn};
    #[test_only]
    use aptos_framework::account::create_account_for_test;

    #[test_only]
    use aptos_framework::system_addresses;


    const APT_address : vector<u8> = b"0x1::aptos_coin::AptosCoin";
    const Seed:vector<u8> = b"asf";
    const Helper_Seed:vector<u8> = b"helper_love";
    const Garble_Seed : vector<u8> = b"Seed for garble";
    const Bank_Seed:vector<u8> = b"bank of diffusion";

    const Diffusion_loyalty_name:vector<u8> = b"loyalty";
    const Diffusion_loyalty_symbol:vector<u8> = b"Dfp";
    const Diffusion_loyalty_decimals:u8 = 0;

    const Collection_name_token_describe:vector<u8> =b"Diffusion Collection";
    const Collection_name:vector<u8> = b"Diffusion";
    const Description_nft:vector<u8> = b"You are really lucky to get this one XD .Fist collection of Diffusion ,I won't sell it lower than 1 APT  ";
    const Name_nft:vector<u8> = b"Diffusion";
    const Url_nft:vector<u8> = b"https://pot-124.4everland.store/diffusion.jpeg";
    const TokenPrefix: vector<u8> = b"df #";

    //v2 badges const
    const Diffusion_badges_collection:vector<u8> =b"Badges of diffusion";
    const Diffusion_badges_describe : vector<u8> =b"Diffusion collection - FA Badges ";
    const Diffusion_badges_url :vector<u8> = b"https://github.com/yue1823/diffusion/blob/main/client/src/art/diffusion_black.png?raw=true";

    //const Helper_Count:u8 = 1;
    const Least_helper:u8 =1;
    const Chance_for_helper :u8 = 2 ;

    ///////// Error Code ///////////

    const Not_admin:u64=1;
    const Not_same_pair:u64 = 2;
    const Not_same_address :u64 =3 ;
    const RESOUREC_already_exist :u64 =4;
    const NOT_exist_pair :u64 =5;
    const NOT_the_right_time_to_claim :u64 =6;
    const NOT_enough_amount:u64 = 7;
    const RESULT_NOT_123:u64 =8;
    const RESULT_NOT_SAME:u64 =9;
    const GUESS_WRONG:u64 = 10 ;
    const NOT_SAME_PAIR_DROP_LOST_CARD:u64 =11;
    const PAIR_TYPE_NOT_TRUE:u64 = 12;
    const NOT_HELPER:u64 =13;
    const NOT_RIGHT_INPUT:u64 =14;
    const ALREADY_UPLOAD:u64= 15;
    const Helper_not_pay_margin:u64 = 16 ;
    const Pair_finish:u64 =17;
    const Too_Much_Helper:u64 =18;
    const ALREADY_EXIST_THIS_PAIR:u64 =19;
    const ALREADY_CREATE_ACCOUNT:u64 =20;
    const Input_of_share_equal_to_resoures_address:u64 =21;
    const Input_ammmount_cant_be_zero:u64=22;
    const Boorow_ZERO:u64 =23;
    const NOT_reource_address:u64 =24;
    const NOT_exist_cylinder:u64 =25;
    const NO_zero_pay_to_user:u64 = 26;
    const NO_same_address_with_user :u64 =27;
    const Create_account_first:u64 =28;
    const Already_have_this_cylinder:u64 = 29;
    const NOT_enought_balance :u64 = 30;
    const Empty_input :u64 = 31;
    const NO_zero_input : u64 =32;
    const Iuput_of_length_not_same:u64 =33;
    const Dont_have_this_cylinder:u64 =34;
    const Already_exists_this_badges:u64=35;
    const Dont_have_this_badges:u64 =36;
    const Dont_have_this_address_in_allow_list:u64 =37;
    const Canot_same_address_with_garble_resources_address:u64=38;
    const Not_exists_diffusion_store_tree:u64 =39;
    const Amount_input_not_same:u64=40;
    const Not_exists_Garble_resource_cap:u64=41;
    const Save_number_must_large_than_1 : u64 =42;
    const Length_of_two_vector_not_same:u64 =43;
    const Coin_type_not_same_as_input_address:u64 =44;
    const Admin_not_set_result:u64 =45;
    const Dont_have_this_helper:u64 = 46;
    const Time_to_helper_upload:u64 =47;
    const Still_Bet_time:u64 =48;
    const Not_lages_admin:u64 =49;
    const Dont_have_this_admin:u64 =50;
    const Already_have_this_admin:u64 = 51;
    const Cant_Same_address_with_caller:u64 = 52;
    const You_dont_bet_this_pair:u64=53;
    const Only_allow_plus:u64 = 54;
    const Already_pay_margin:u64 =55;
    const Pair_length_not_same_as_Chips:u64=56;
    const Save_result_too_short : u64 =57;
    const Save_can_claim_too_short:u64 =58;
    const Save_pair_too_short:u64 =59;
    const Save_chips_too_short:u64 =60;
    const Save_admin_set_result:u64 =61;
    const Admin_already_upload_result:u64=62;
    const NOT_sure_of_burn:u64=63;
    const No_this_badges :u64 = 64;
    const Already_create_badges_collection:u64 =65;
    const Not_owner_of_nft:u64=66;
    ///////// Error Code ///////////


    //////// Other Moduler Struct //////
    struct Rndom_Seed has key,copy,store{
        random_seed1:u64,
        random_seed2:u64
    }
    struct Badges has key , copy,store,drop{
        Name:string::String,
        url:string::String,

    }
    struct Bet_data has key,store,drop{
        save_address:address,
        save_amount:u64,

    }
    struct Save_user_bet has key,store{
        pair:Pair,
        save_bet_data:vector<Bet_data>
    }
    struct Badges_list has key,copy,store,drop{
        save_Badges:Badges,
        save_can_mint:bool,
        save_allow_list : vector<address>,
        save_list:vector<address>,
    }
    struct Level has key,copy,store{
        level:u64,
        win:u64,
        lose:u64,
        diffusion_loyalty:u64,
    }
    struct Cap_of_diffusion has key {
        diffusion_point_mint_cap:MintCapability<Diffusion_loyalty>,
        mutator_ref:collection::MutatorRef,
    }
    struct ResourceCap has key{
        cap:SignerCapability
    }
    struct TokenRefsStore has key {
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
        extend_ref: object::ExtendRef,
        transfer_ref: option::Option<object::TransferRef>
    }
    struct Diffusion_loyalty has key{}
    struct Account_tree has key,store,copy {
        save_1:Profile ,
        save_2:vector<Bet_card>,
        save_3:Rndom_Seed,
        save_4:vector<Badges>,
        save_5:Level
    }
    struct Diffusion_store_tree has key{
            save_Pair_result_store:Pair_result_store,
            save_Helper_list:Helper_list,
            fee:Diffusion_fee,
            save_helper_chance:Chance,
            save_Cylinder_Pairs:vector<Cylinder_Pairs>,
            save_badges_list:vector<Badges_list>
    }
    struct Cylinder_Pairs has key,store,drop,copy{
        coin:string::String,
        coin_address:address,
        pair_number:u64,
        save_number:u64,
        save_total:u64,
        send_address_vector:vector<address>,
        send_amount_vector:vector<u64>,
        already_send:u64
    }
    struct Pair_result_store has key,store {
        save_admin_set_result:vector<bool>,
        save_can_claim:vector<bool>,
        save_result:vector<u8>,
        save_pair:vector<Pair>,
        save_chips : vector<Chips>,
        save_user:vector<Save_user_bet>,
        save_lost_pair:smart_vector::SmartVector<Ended_pair>,
    }
    struct Ended_pair has key,store{
        save_pair:Pair,
        result:u8,
    }
    struct Pair has key,drop,copy,store{
        pair_type:string::String,
        pair_name:string::String,
        left_url:string::String,
        right_url:string::String,
        left:u64,
        left2:u64,
        middle:u64,
        middle2:u64,
        right:u64,
        right2:u64,
        can_bet:bool,
        expired_time:u64
    }

    struct Chips has key,store,copy,drop{
        left:u64,
        middle:u64,
        right:u64,
        given:u64
    }
    struct Bet_card has key,store,drop,copy{
        account:address,
        which:u8,
        pair:Pair,
        bet:u64,
        a_win:u64,
        b_win:u64,
        c_win:u64,
        time:u64,
        expired_time:u64,
    }
    struct Profile has key,store,copy{
        name:string::String,
        account_address:address,
        icon:string::String,
        account_Amount:u64
    }
    struct Diffusion_coin has key {}
    //////// Other Moduler Struct //////

    struct CollectionRefsStore has key{

        mutator_ref:collection::MutatorRef,

    }
    struct Diffusion_fee has key,copy,store,drop{
        margin:u64,
        fees_1:u64,
        fees_2:u64,
        allocation_share_1:u64,
        allocation_share_2:u64,
        bank_share_1:u64,
        bank_share_2:u64,
        nft_chance_1:u64,
        nft_chance_2:u64,
        nft_id:u64
    }
    struct Helper_upload_result has key,drop,copy,store{
        pair:Pair,
        result:u8,
        upload_time:u64,
        right_or_not:vector<bool>
    }

    struct Helper has key,drop,copy,store{
        account:address,
        helper_contribute:vector<Helper_upload_result>,
        helper_point:u64,
        upload_times:u64,
        wrong_times:u64,
        pay_margin:bool,
        need_admin:bool
    }
    struct Helper_allocation has key,copy,store,drop{
        pair:Pair,
        allocation:u64,
        time_period:string::String,
        ended:bool
    }
    struct Helper_list has key,drop,copy,store{
        list:vector<Helper>,
        period:vector<Helper_allocation>,
        admin_list:vector<address>,
    }
    struct Chance has key,drop,copy,store{
        maximun_helper_num:u64,
        heler_number:u64,
        least_helper_result:u8,
        chance_for_wrong_time:u8
    }
    //v2
    struct Object_collection has key,store{
        trans_ref : object::TransferRef,
        extend_ref : object::ExtendRef,
    }
    struct Object_token has key,store {
        trans_ref : object::TransferRef,
        extend_ref : object::ExtendRef,
        del_ref:object::DeleteRef
    }
    struct Object_cap_main has key,store {
        obj_address:address,
        extend_ref:object::ExtendRef,
        trans_ref:object::TransferRef
    }
    struct NFT_cap_user has key, store,drop {
        mut_ref:token::MutatorRef,
        burn_ref:token::BurnRef
    }
    struct NFT_badges has key ,store,drop{
        badges:Badges,
        cap:NFT_cap_user,

    }
    struct Store_nft_data has key , store,drop{
        obj:Object<Token>,
        name_of_nft:string::String,
        address_of_token:address,
    }
    struct User_store_object_address has key , store ,drop{
        store_obj_address : vector<Store_nft_data>
    }
    ////////////////// view fun /////////////////////////////////
    #[view]
    public fun check_badges_list():vector<Badges_list> acquires Diffusion_store_tree {
        borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list
    }
    #[view]
    public fun check_user_card(user_address:address,card_name:string::String,expired_date:u64):(bool,Bet_card) acquires Account_tree {

        let have_or_not = false;
        let i =0;
        let index =99;
        let length = vector::length(&borrow_global<Account_tree>(user_address).save_2);
        while(i < length){
            let borrow = vector::borrow(&borrow_global<Account_tree>(user_address).save_2,i);
            if(borrow.expired_time == expired_date){
                if(borrow.pair.pair_name == card_name){
                    index =i;
                    have_or_not=true;
                }
            };
            i = i +1;
        };
        let null_bet = Bet_card{
            account:@0x1,
            which:99,
            pair:Pair{
                pair_type:utf8(b""),
                pair_name:utf8(b""),
                left_url:utf8(b""),
                right_url:utf8(b""),
                left:0,
                left2:0,
                middle:0,
                middle2:0,
                right:0,
                right2:0,
                can_bet:false,
                expired_time:0
            },
            bet:0,
            a_win:0,
            b_win:0,
            c_win:0,
            time:0,
            expired_time:0,
        };
        if(i != 99 ){
            return (have_or_not,*vector::borrow(&borrow_global<Account_tree>(user_address).save_2,i))
        }else{return (have_or_not,null_bet)}
    }
    #[view]
    public fun check_user_badges(user_address:address,badges_name:string::String):(bool,Badges,vector<Badges>) acquires Diffusion_store_tree, Account_tree {
        let borrow = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list;
        let i=0;
        let length = vector::length(&borrow);
        let right = false;
        let index = 99;
        while(i < length) {
            let specfic = vector::borrow(&borrow, i);
            if (specfic.save_Badges.Name == badges_name) {
                let f = 0;
                let length2 = vector::length(&specfic.save_list);
                index = i;
                while (f < length2) {
                    let specfic_address = vector::borrow(&specfic.save_list, f);
                    if (specfic_address == &user_address) {
                        right = true;
                    };
                    f = f + 1;
                };
            };
            i = i + 1;
        };
        if(index != 99){return (right,  vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_Badges,borrow_global<Account_tree>(user_address).save_4)}else{
            let new_badges = Badges{ Name:utf8(b""),url:utf8(b"")};
            return(false , new_badges,vector::empty<Badges>())
        }

    }
    #[view]
    public fun check_helper_list(helper_address:address):(bool,bool) acquires Diffusion_store_tree {
        let borrow = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list;
        let i=0;
        let length = vector::length(&borrow);
        let right1=false;
        let right2 = false;
        while(i < length){
            let specfic_helper = vector::borrow(&borrow,i);
            if(specfic_helper.account == helper_address){
                right1=true;
                if(specfic_helper.pay_margin == true){
                    right2=true
                };
            };

            i=i+1;
        };
        return (right1,right2)
    }
    #[view]
    public fun helper_upload_which_result(helper_address:address):Helper  acquires Diffusion_store_tree {

        let i=0;
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list);
        let index= 99;
        while(i < length){
            let specfic_helper = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i);
            if(specfic_helper.account == helper_address){
                index = i ;
            };
            i=i+1;
        };
        if(index !=99){*vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,index)}else{
            let new_helper = Helper{
                account:@0x1,
                helper_contribute:vector::empty<Helper_upload_result>(),
                helper_point:0,
                upload_times:0,
                wrong_times:0,
                pay_margin:false,
                need_admin:false,
            };
            return new_helper
        }

    }
    #[view]
    public fun get_pair_data(pair_name:string::String,expire_data:u64):(Pair,Chips,bool,bool) acquires Diffusion_store_tree {
        let borrow = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair;
        let i = 0 ;
        let length = vector::length(&borrow);
        let index= 99;
        while(i < length ){
            let specfic_pair = vector::borrow(&borrow,i);
            if(specfic_pair.pair_name == pair_name){
                    if(specfic_pair.expired_time == expire_data){
                        index =i
                    };
                };
            i=i+1;
        };
        if(index !=99){
            return (*vector::borrow(&borrow,index),*vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index),*vector::borrow( &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index),*vector::borrow( &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,index))}
        else{
            let new_pair = Pair{
                pair_type:utf8(b""),
                pair_name:utf8(b""),
                left:0,
                left2:0,
                middle:0,
                middle2:0,
                right:0,
                right2:0,
                left_url:utf8(b""),
                right_url:utf8(b""),
                expired_time:0,
                can_bet:false
            };
            let new_chips = Chips{
                left:0,
                middle:0,
                right:0,
                given:0
            };
            return (new_pair,new_chips,false,false)
        }

    }

    ////////////////// Helper fun /////////////////////////////////
    public entry fun helper_upload_result(caller:&signer,pair_name1:string::String,which:u8,expired_time:u64) acquires Diffusion_store_tree, Account_tree {
        // if(vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list) >= (Least_helper as u64)){
        //     all_helper_result(caller);
        // };
        // all_helper_result(caller);
        assert!(exists<Account_tree>(signer::address_of(caller)  )== true,Create_account_first);
        assert!(exists<Diffusion_store_tree>(create_resource_address(&@dapp,Seed))== true,Not_exists_diffusion_store_tree);

        too_much_wrong_is_time_to_click_it_out(caller);
        asc3(caller);

        let helper_index = check_helper_index(caller);
        assert!(helper_index !=99,NOT_HELPER);
        assert!(which==1||which==2||which==3,NOT_RIGHT_INPUT);


        let pair_index = check_pair_index(caller,pair_name1,expired_time);
        assert!(pair_index!=99,NOT_exist_pair);
        assert!(vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,pair_index).can_bet == false , Still_Bet_time);
        let helper_upload_result_index  = check_helper_upload_result_index(caller,pair_index,helper_index);

        assert!(helper_upload_result_index==99,ALREADY_UPLOAD);

        let admin_set =vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,pair_index) ;
        let can_claim = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,pair_index) ;

        assert!(admin_set != &true && can_claim!=&true,Pair_finish);

        let borrow_helper_list = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));
        let specfic_helper = vector::borrow_mut(&mut borrow_helper_list.save_Helper_list.list,helper_index);

        assert!(specfic_helper.pay_margin==true,Helper_not_pay_margin);

       // let borrow_pair_reult = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store;
        let spedcfic_pair = vector::borrow(&borrow_helper_list.save_Pair_result_store.save_pair,pair_index);

        let new_upload_result = Helper_upload_result{
            pair:Pair{
                pair_type:spedcfic_pair.pair_type,
                pair_name:spedcfic_pair.pair_name,
                left_url:spedcfic_pair.left_url,
                right_url:spedcfic_pair.right_url,
                left:spedcfic_pair.left,
                left2:spedcfic_pair.left2,
                middle:spedcfic_pair.middle,
                middle2:spedcfic_pair.middle2,
                right:spedcfic_pair.right,
                right2:spedcfic_pair.right2,
                can_bet:spedcfic_pair.can_bet,
                expired_time:spedcfic_pair.expired_time
            },
            result:which,
            upload_time:timestamp::now_seconds(),
            right_or_not:vector::empty<bool>()
        };


        vector::push_back(&mut specfic_helper.helper_contribute,new_upload_result);
        // debug::print(&utf8(b"upload result"));
        // debug::print(&specfic_helper.helper_contribute);
        specfic_helper.upload_times = specfic_helper.upload_times + 1;

    }

    public entry fun apply_to_be_helper(caller:&signer) acquires Diffusion_store_tree, Account_tree {
        let helper_index = check_helper_index(caller);
        assert!(helper_index!=99,NOT_HELPER);
        assert!(exists<Account_tree>(signer::address_of(caller)),Create_account_first);

        // let helper_vector = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));
        // let specfic_helper = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,helper_index);
         if(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,helper_index).pay_margin == false){
            pay_margin_to_account(caller);
            vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,helper_index).pay_margin=true;
            let helper_badges = Badges{Name:utf8(b"Helper"),url:utf8(b"https://pot-124.4everland.store/helper_badges.png")};
            vector::push_back(&mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_4,helper_badges);
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.heler_number = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.heler_number+1;
        }else{
            assert!(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,helper_index).pay_margin != true,Already_pay_margin);
        }


    }


    public entry fun mint_badges(caller:&signer,badges:string::String) acquires Diffusion_store_tree, Account_tree {
        let i= 0;
        let length =vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list);
        let index =99;
        while(i < length ){
            let specfic = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,i);
            if(specfic.save_Badges.Name ==badges){
                index = i;
            };
            i=i+1;
        };
        assert!(index != 99 ,Dont_have_this_badges);
        if (vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_can_mint == true){
            let e = 0 ;
            let length3 = vector::length(&vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_allow_list);
            while(e < length3 ) {
                let specfi_borrow = vector::borrow(
                    &vector::borrow(
                        &borrow_global_mut<Diffusion_store_tree>(
                            create_resource_address(&@dapp, Seed)
                        ).save_badges_list,
                        index
                    ).save_allow_list,
                    e
                );
                if (specfi_borrow == &signer::address_of(caller)) {
                    let f = 0 ;
                    let length2 = vector::length(&borrow_global<Account_tree>(signer::address_of(caller)).save_4);
                    let where = 99;
                    while(f < length2){
                        let specfic = vector::borrow(&borrow_global<Account_tree>(signer::address_of(caller)).save_4,f);
                        if(specfic.Name == badges){
                            where = f;
                        };
                        f=f +1;
                    };
                    assert!(where == 99 ,Already_exists_this_badges);
                    let new_badges = Badges{
                        Name:vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_Badges.Name,
                        url:vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_Badges.url,
                    };
                    push_back(&mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_4,new_badges);
                    vector::push_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_list , signer::address_of(caller));
                };
                e = e + 1;
            }
        }else{
            let f = 0 ;
            let length2 = vector::length(&borrow_global<Account_tree>(signer::address_of(caller)).save_4);
            let where = 99;
            while(f < length2){
                let specfic = vector::borrow(&borrow_global<Account_tree>(signer::address_of(caller)).save_4,f);
                if(specfic.Name == badges){
                    where = f;
                };
                f=f +1;
            };
            assert!(where == 99 ,Already_exists_this_badges);
            let new_badges = Badges{
                Name:vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_Badges.Name,
                url:vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_Badges.url,
            };
            push_back(&mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_4,new_badges);
            vector::push_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_list , signer::address_of(caller));
        }
    }
    ////////////////// Helper fun /////////////////////////////////

    ////////////////// Admin fun /////////////////////////////////

    public entry fun admin_set_badges(caller:&signer,job:string::String,badges:string::String,target:address,set_can_mint:bool) acquires Diffusion_store_tree {
        let admin_index = check_admin_index(signer::address_of(caller));
        assert!(admin_index !=99 ||signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin1,Not_admin);
        let i= 0;
        let length =vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list);
        let index =99;
        while(i < length ){
            let specfic = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,i);
            if(specfic.save_Badges.Name ==badges){
                index = i;
            };
            i=i+1;
        };
        assert!(index != 99 ,Dont_have_this_badges);
        if(job == utf8(b"add")){
            vector::push_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_allow_list,target);
        }
        else if(job == utf8(b"minus")){
            let f =0;
            let length2 = vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_allow_list);
            let where =99;
            while(f < length2 ){
                let borrow = vector::borrow(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_allow_list,f);
                if(borrow == &target){
                    where = f;
                };
                f= f+1;
            };
            assert!(f != 99 ,Dont_have_this_address_in_allow_list);
            vector::remove(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_allow_list,where);
        }
        else if(job == utf8(b"set")){
            vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,index).save_can_mint = set_can_mint;
        }

    }
    fun check_admin_index(target:address):u64 acquires Diffusion_store_tree {
        let i = 0;
        let length =vector::length(& borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.admin_list);
        while(i < length){
            let borrow = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.admin_list,i);
            if(&target == borrow){
                return i
            };
            i=i+1;
        } ;
        return 99
    }
    public entry fun admin_set_admin (caller:&signer,add_or_delete:string::String,target_address:address) acquires Diffusion_store_tree {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin1,Not_lages_admin);
        assert!(exists<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)) == true,Not_exists_diffusion_store_tree);
        let admin_index = check_admin_index(target_address);

        if(add_or_delete == utf8(b"add")){
            assert!(admin_index ==99 ,Already_have_this_admin);
            vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.admin_list,target_address);
        }else if(add_or_delete == utf8(b"delete")){
            assert!(admin_index !=99,Dont_have_this_admin );
            vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.admin_list,admin_index);
        }
    }
    public entry fun admin_said_times_up(caller:&signer,pair:string::String,expired_time:u64) acquires Diffusion_store_tree {
        let admin_index = check_admin_index(signer::address_of(caller));
        assert!(admin_index !=99 || signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin1,Not_admin);
        let index = check_pair_index(caller,pair,expired_time);
        assert!(index != 99 ,NOT_exist_pair);
        vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index).can_bet = false ;
    }
    public entry fun create_or_delete_badges (caller:&signer,create_or_delete:string::String,badges:string::String,url1:string::String,can_mint:bool) acquires Diffusion_store_tree {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin1,Not_admin);
        let i= 0;
        let length =vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list);
        let index =99;
        while(i < length ){
            let specfic = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,i);
            if(specfic.save_Badges.Name ==badges){
                index = i;
            };
            i=i+1;
        };

        if(create_or_delete == utf8(b"create")){
            assert!(index == 99 ,Already_exists_this_badges);
            let new_badges=Badges_list{
                save_Badges:Badges{Name:badges,url:url1},
                save_can_mint:can_mint,
                save_allow_list:vector::empty(),
                save_list:vector::empty(),
            };
            push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_badges_list,new_badges);
        }
        else if(create_or_delete == utf8(b"delete")){
            if(length != 0) {
                assert!(index != 99, Dont_have_this_badges);
                vector::remove<Badges_list>(
                    &mut borrow_global_mut<Diffusion_store_tree>(
                        create_resource_address(&@dapp, Seed)
                    ).save_badges_list,
                    index
                );
            }
        }
    }
    public entry fun set_chance(caller:&signer,which_one:string::String,fee1:u64,fee2:u64) acquires Diffusion_store_tree {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);
        assert!(exists<Diffusion_store_tree>(create_resource_address(&@dapp,Seed))==true,Not_exists_diffusion_store_tree);
        if(which_one==utf8(b"margin")){
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.margin=fee1;
        }else if(which_one==utf8(b"fee")){
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.fees_1=fee1;
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.fees_2=fee2;
        }else if(which_one==utf8(b"share")){
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.allocation_share_1=fee1;
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.allocation_share_2=fee2;
        }else if(which_one==utf8(b"max helper")){
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.maximun_helper_num=fee1;
        }else if(which_one==utf8(b"least helper")){
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.least_helper_result= (fee1 as u8);
        }else if(which_one==utf8(b"wrong")){
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.chance_for_wrong_time= (fee1 as u8);

        }else if(which_one==utf8(b"nft chance")){
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_1 = fee1 ;
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_2 = fee2 ;
        }else if(which_one==utf8(b"bank share")){
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.bank_share_1 = fee1 ;
            borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.bank_share_2 = fee2 ;
        };
    }
    public entry fun set_cylinder_sav_number(caller:&signer,save_number:u64,coin1:string::String,coin_address1:address,send_coin_amount1:u64) acquires Diffusion_store_tree {
        assert!(signer::address_of(caller) == @admin1 ||signer::address_of(caller) == @admin2 ,Not_admin  );
        assert!(save_number > 1 ,Save_number_must_large_than_1 );
        let index = find_coin_index_in_main_tree(coin1,coin_address1,send_coin_amount1);
        assert!(index != 99 ,Dont_have_this_cylinder);
        vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_number = save_number;
    }
    public entry fun create_cylinder(caller:&signer,coin1:string::String,coin_address1:address,send_coin_amount1:u64) acquires Diffusion_store_tree {
        let admin_index = check_admin_index(signer::address_of(caller));
        assert!(admin_index != 99 ||signer::address_of(caller) == @admin1 ||signer::address_of(caller) == @admin2 ,Not_admin  );
        let index = find_coin_index_in_main_tree(coin1,coin_address1,send_coin_amount1);
        assert!(index == 99 ,Already_have_this_cylinder);
        let new_cylinder = Cylinder_Pairs{
            coin:coin1,
            coin_address:coin_address1,
            pair_number:send_coin_amount1,
            save_number:1,
            save_total:0,
            send_amount_vector:vector::empty<u64>(),
            send_address_vector:vector::empty<address>(),
            already_send:0
        };
        // vector::push_back(&mut new_cylinder.send_address_vector,@admin1);
        // vector::push_back(&mut new_cylinder.send_amount_vector,1);
        vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,new_cylinder);
    }
    public entry fun create_helper(caller:&signer,add_or_delete:string::String,helper_adddress:address) acquires Diffusion_store_tree {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);
        if(add_or_delete == utf8(b"add")) {
            assert!(
                (vector::length(
                    &borrow_global_mut<Diffusion_store_tree>(
                        create_resource_address(&@dapp, Seed)
                    ).save_Helper_list.list
                ) < borrow_global_mut<Diffusion_store_tree>(
                    create_resource_address(&@dapp, Seed)
                ).save_helper_chance.maximun_helper_num),
                Too_Much_Helper
            );
            let borrow_helper_list = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp, Seed));
            let length = vector::length(&borrow_helper_list.save_Helper_list.list);
            let i = 0;
            let done = false;
            if (length == 0) {
                let new_helper = Helper {
                    account: helper_adddress,
                    helper_contribute: vector::empty<Helper_upload_result>(),
                    helper_point: 0,
                    upload_times: 0,
                    wrong_times: 0,
                    pay_margin: false,
                    need_admin: false
                };
                vector::push_back(&mut borrow_helper_list.save_Helper_list.list, new_helper);
            }else {
                while (i < length) {
                    let borrow = vector::borrow(&borrow_helper_list.save_Helper_list.list, i);
                    if (borrow.account == helper_adddress) {
                        return
                    };
                    if (i == length - 1) {
                        done = true
                    };
                    i = i + 1;
                };

                if (done == true) {
                    let new_helper = Helper {
                        account: helper_adddress,
                        helper_contribute: vector::empty<Helper_upload_result>(),
                        helper_point: 0,
                        upload_times: 0,
                        wrong_times: 0,
                        pay_margin: false,
                        need_admin: false
                    };
                    vector::push_back(&mut borrow_helper_list.save_Helper_list.list, new_helper);
                };
            };
        }else if(add_or_delete == utf8(b"delete")){
            let i =0;
            let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list);
            let index= 99;
            while(i < length){
                let specfic = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i);
                if(specfic.account ==helper_adddress){
                    index = i;
                };
                i=i+1;
            };
            assert!(index != 99 , Dont_have_this_helper);
            vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,index);
        }
        // let helper_index = check_helper_index(caller);
        // assert!(helper_index!=99,NOT_HELPER);
    }

    ////////////////// Admin fun /////////////////////////////////


    public entry fun burn_card(caller:&signer,pair_name1:string::String,expired_date1:u64,sure:bool) acquires Account_tree {

        assert!(exists<Account_tree>(signer::address_of(caller)),Create_account_first);
        let i = 0 ;
        let length = vector::length(&borrow_global<Account_tree>(signer::address_of(caller)).save_2);
        let index =99;
        while(i < length){
            let specfic = vector::borrow(&borrow_global<Account_tree>(signer::address_of(caller)).save_2,i);
            if(specfic.pair.pair_name == pair_name1){
                if(specfic.expired_time == expired_date1){
                    index = i;
                };
            };
            i=i+1;
        };
        assert!(index != 99 , NOT_exist_pair);
        assert!(sure == true,NOT_sure_of_burn);
        vector::remove(&mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,index);
    }
    ///user fun

    #[view]
    public fun return_badges (target:address):vector<Badges> acquires Account_tree{
        let new_vector = vector::empty<Badges>();
        let length = vector::length(&borrow_global<Account_tree>(target).save_4);
        let i = 0 ;
        while(i < length ){
            let specfic = vector::borrow(&borrow_global<Account_tree>(target).save_4,i);
            let new_badges = Badges{
                Name:specfic.Name,
                url:specfic.url
            };
            vector::push_back(&mut new_vector,new_badges);
            i=i+1;
        };
        return new_vector
    }
    #[view]
    public fun return_nft_data (target:address):vector<Store_nft_data> acquires User_store_object_address {
        let new_vector = vector::empty<Store_nft_data>();
        let length = vector::length(&borrow_global<User_store_object_address>(target).store_obj_address);
        let i = 0 ;
        while(i < length ){
            let specfic = vector::borrow(&borrow_global<User_store_object_address>(target).store_obj_address,i);
            let new_badges = Store_nft_data{
                obj:specfic.obj,
                name_of_nft:specfic.name_of_nft,
                address_of_token:specfic.address_of_token
            };
            vector::push_back(&mut new_vector,new_badges);
            i=i+1;
        };
        return new_vector
    }
    public entry fun add_badges_to_single_account(caller:&signer,badges_name:string::String) acquires Account_tree {
        assert!(exists<Account_tree>(signer::address_of(caller)),Create_account_first);
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);
        let borrow = borrow_global_mut<Account_tree>(signer::address_of(caller));
        let new_badges = Badges{
            Name:badges_name,
            url:utf8(b"")
        };
        vector::push_back(&mut borrow.save_4,new_badges );
    }
    public entry fun nft_burn_to_badges(caller:&signer,badges_name:string::String) acquires User_store_object_address, NFT_badges,Account_tree{
        assert!(exists<Account_tree>(signer::address_of(caller)),Create_account_first);
        assert!(exists<ResourceCap>(create_resource_address(&@dapp,Seed)),NOT_reource_address);
        //let borrow = borrow_global_mut<User_store_object_address>(signer::address_of(caller));
        let (have_or_not,index) = vector::find(&borrow_global_mut<User_store_object_address>(signer::address_of(caller)).store_obj_address,|store|seach_user_store_token_object(store,badges_name));
        if(have_or_not){
           // let old_nft = vector::borrow(&borrow.store_obj_address,index);
            let is_owner_yes_or_not = is_owner( vector::borrow(&borrow_global_mut<User_store_object_address>(signer::address_of(caller)).store_obj_address,index).obj,signer::address_of(caller));
             // debug::print(&utf8(b"is owner "));
             // debug::print(& is_owner_yes_or_not);
            if(is_owner_yes_or_not ==  false){
                vector::swap_remove(&mut borrow_global_mut<User_store_object_address>(signer::address_of(caller)).store_obj_address,index);
                return
            };
            // debug::print(&utf8(b"###########################"));
            // debug::print(&utf8(b"user account nft"));
            // debug::print(&return_nft_data(signer::address_of(caller)));

           // assert!(is_owner_yes_or_not == true,Not_owner_of_nft);
            let pay_fee = withdraw<AptosCoin>(caller,2000000);
            deposit(create_resource_address(&@dapp,Seed),pay_fee);

            // let token_data =&borrow_global<NFT_badges>(old_nft.address_of_token).cap;
            let NFT_badges{badges,cap} = move_from<NFT_badges>( vector::borrow(&borrow_global_mut<User_store_object_address>(signer::address_of(caller)).store_obj_address,index).address_of_token);
            let NFT_cap_user{mut_ref,burn_ref } = cap;
            // debug::print(&utf8(b"is owner of caller"));
            // debug::print(& object::is_owner(old_nft.obj,signer::address_of(caller)));
            burn(burn_ref);
            vector::push_back(&mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_4,badges);
            vector::swap_remove(&mut borrow_global_mut<User_store_object_address>(signer::address_of(caller)).store_obj_address,index);
        }
    }
    public entry fun turn_badges_to_nft (caller:&signer,badges_name:string::String) acquires Account_tree, ResourceCap, User_store_object_address {
        assert!(exists<Account_tree>(signer::address_of(caller)),Create_account_first);
        assert!(exists<ResourceCap>(create_resource_address(&@dapp,Seed)),NOT_reource_address);
        let resorce_cap =borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
        let resource_signer = create_signer_with_capability(&resorce_cap.cap);
        let account_tree = borrow_global_mut<Account_tree>(signer::address_of(caller));
        let (badges_true_or_not,badges_index) = vector::find(&account_tree.save_4,|badges| filter_search_bearch_on_user_account(badges,badges_name));
        assert!(badges_true_or_not == true ,No_this_badges);
        if(badges_true_or_not){
            let pay_fee = withdraw<AptosCoin>(caller,2000000);
            deposit(create_resource_address(&@dapp,Seed),pay_fee);
            let royalthy = royalty::create(10,100,@admin1);
            let option_ro = option::some(royalthy);
            let new_name=utf8(b" - ");
            let badges1 = vector::swap_remove(&mut account_tree.save_4,badges_index);
            string::append(&mut new_name,badges_name);
            let token_cons = &token::create_numbered_token(&resource_signer,utf8(Diffusion_badges_collection),utf8( Diffusion_badges_describe ),utf8(b"Diffusion Badges #"),new_name,option_ro,badges1.url);
            let token_mutref = token::generate_mutator_ref(token_cons);
            let token_burnref = token::generate_burn_ref(token_cons);
            let token_signer = object::generate_signer(token_cons);
            let token_obj_transref = object::generate_transfer_ref(token_cons);
            let token_obj_extend = object::generate_extend_ref(token_cons);
            let new_obj_cap = Object_cap_main{
                obj_address:object::address_from_constructor_ref(token_cons),
                extend_ref:token_obj_extend,
                trans_ref:token_obj_transref
            };
            move_to(&token_signer,new_obj_cap);
            if(!exists<User_store_object_address>(signer::address_of(caller))){
                move_to(caller,User_store_object_address{
                    store_obj_address :vector::empty<Store_nft_data>()
                })
            };
            let User_store_object_address{store_obj_address}=move_from<User_store_object_address>(signer::address_of(caller));
            let new_store = Store_nft_data{
                obj:object::object_from_constructor_ref<Token>(token_cons),
                name_of_nft:badges_name,
                address_of_token:object::address_from_constructor_ref(token_cons)
            };
            vector::push_back(&mut store_obj_address,new_store );
            move_to(caller,User_store_object_address{store_obj_address});
            let new_nft_cap = NFT_cap_user{
                mut_ref:token_mutref,
                burn_ref:token_burnref,
            };
            let new_nft = NFT_badges{
                badges:badges1,
                cap:new_nft_cap
            };
            move_to(&token_signer,new_nft);
            object::transfer(&resource_signer,object::object_from_constructor_ref<Token>(token_cons),signer::address_of(caller))
        }
    }
    fun filter_search_bearch_on_user_account(badges:&Badges,name:string::String):bool{
        badges.Name == name
    }
    fun seach_user_store_token_object(store:&Store_nft_data,target_search:string::String):bool{
        store.name_of_nft == target_search
    }
    public entry fun  init_for_badges_collection(caller:&signer) acquires ResourceCap {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);
        assert!(exists<Object_cap_main>(create_resource_address(&@dapp,Seed))== false,Already_create_badges_collection);
        let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
        let resource_signer  = create_signer_with_capability(&borrow.cap);
        let royalthy = royalty::create(10,100,@admin1);
        let option_ro = option::some(royalthy);
        let construct = &create_unlimited_collection(&resource_signer,utf8(Diffusion_badges_describe),utf8(Diffusion_badges_collection),option_ro,utf8(Diffusion_badges_url));
        let object_ext = object::generate_extend_ref(construct);
        let object_tran = object::generate_transfer_ref(construct);
        move_to(&resource_signer,Object_cap_main{
            obj_address:object::address_from_constructor_ref(construct),
            extend_ref:object_ext,
            trans_ref:object_tran
        });
    }
    #[test(aptos_framework=@aptos_framework,admin=@admin1,caller=@dapp,user1=@0x789,user2=@0x123)]
    fun test_badges(aptos_framework:&signer,admin:&signer,caller:&signer,user1:&signer,user2:&signer) acquires Account_tree, User_store_object_address, ResourceCap, NFT_badges {
        let apt_mint_cap= prepare_test(aptos_framework,caller);
        prepare_user_account_for_test(admin,&apt_mint_cap);
        prepare_user_account_for_test(user1,&apt_mint_cap);
        prepare_user_account_for_test(user2,&apt_mint_cap);
        // coin::deposit(signer::address_of(user2),coin::mint(2000000000,&apt_mint_cap));
        // coin::deposit(signer::address_of(user1),coin::mint(2000000000,&apt_mint_cap));
        coin::destroy_mint_cap(apt_mint_cap);

        init_module(caller);

        init_for_badges_collection(admin);

        create_account_tree(user2,utf8(b"user1"),utf8(b""));
        create_account_tree(user1,utf8(b"user1"),utf8(b""));
        create_account_tree(admin,utf8(b"admin"),utf8(b""));

        turn_badges_to_nft(user2,utf8(b"User"));
        turn_badges_to_nft(user1,utf8(b"User"));

        let borrow = borrow_global<User_store_object_address>(signer::address_of(user1));
        let (badges_true,index_of_badges) = vector::find(&borrow.store_obj_address,|badges_2| seach_user_store_token_object(badges_2,utf8(b"User")));
        if(badges_true){
             let specfic = vector::borrow(& borrow.store_obj_address,index_of_badges);
             let token_address = object::address_to_object<Token>(specfic.address_of_token);
             // debug::print(&utf8(b"token owner - user1 "));
             // debug::print(&is_owner(token_address,signer::address_of(user1)));
             // debug::print(&utf8(b"token owner - user2 "));
             // debug::print(&is_owner(token_address,signer::address_of(user2)));
             // debug::print(&utf8(b"token owner - caller "));
             // debug::print(&is_owner(token_address,signer::address_of(caller)));
             // debug::print(&utf8(b"token owner - resource "));
             // debug::print(&is_owner(token_address,create_resource_address(&@dapp,Seed)));
            // let Object_cap_main{   obj_address, extend_ref, trans_ref} = move_from<Object_cap_main>(specfic.address_of_token);
              object::transfer(user1,token_address,signer::address_of(user2));

            // debug::print(&utf8(b"admin account nft"));
            // debug::print(&return_nft_data(signer::address_of(admin)));
            debug::print(&utf8(b"user account nft"));
            debug::print(&return_nft_data(signer::address_of(user1)));

            //nft_burn_to_badges(admin,utf8(b"User"));
             nft_burn_to_badges(user1,utf8(b"User"));

            debug::print(&utf8(b"user account nft"));
            debug::print(&return_nft_data(signer::address_of(user1)));

            // debug::print(&utf8(b"token owner - user1 "));
            // debug::print(&is_owner(token_address,signer::address_of(user1)));
            // debug::print(&utf8(b"token owner - user2 "));
            // debug::print(&is_owner(token_address,signer::address_of(user2)));
            // debug::print(&utf8(b"token owner - caller "));
            // debug::print(&is_owner(token_address,signer::address_of(caller)));
            // debug::print(&utf8(b"token owner - resource "));
            // debug::print(&is_owner(token_address,create_resource_address(&@dapp,Seed)));
        };



        // debug::print(&utf8(b"admin account badge"));
        // debug::print(&return_badges(signer::address_of(admin)));
        // debug::print(&utf8(b"user account badge"));
        // debug::print(&return_badges(signer::address_of(user1)));





        // debug::print(&utf8(b"admin account"));
        // debug::print(borrow_global<Account_tree>(signer::address_of(admin)));
        // debug::print(&utf8(b"user account "));
        // debug::print(borrow_global<Account_tree>(signer::address_of(user1)));

        // debug::print(&utf8(b"admin balance"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(admin)));
        // debug::print(&utf8(b"user1 balance"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(user1)));
        // debug::print(&utf8(b"user2 balance"));
        // debug::print(&coin::balance<AptosCoin>(signer::address_of(user2)));

    }

    ////////////////// Logic fun /////////////////////////////////


    fun upgarde_user_level(caller:&signer) acquires Account_tree {
        let  point =  borrow_global<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty;
        let  level = borrow_global<Account_tree>(signer::address_of(caller)).save_5.level;
        if(level == 1 || level == 2 || level ==3 ||level == 0 ){
           let now_level =  point/10;
            let r = point%10;
            if(r == 0 ){
                if(now_level != level){
                    if(now_level > level){
                        borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.level+1;
                    }
                }
            }
        }else{
            let upgrade_required = level/2;
            let r = point%10;
            let now_level =  (point-40)/(10*upgrade_required);
            if(r == 0){
                if(now_level > level){
                     borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.level+1;
                }
            }
        }
    }
    fun too_much_wrong_is_time_to_click_it_out(caller:&signer) acquires Diffusion_store_tree, Account_tree {
        let index= check_helper_index(caller);
        assert!(index!=99,NOT_HELPER);
        let a=borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));
        let helper = vector::borrow(&a.save_Helper_list.list,index);
        if(helper.wrong_times == (a.save_helper_chance.chance_for_wrong_time as u64)){
            vector::remove(&mut a.save_Helper_list.list,index);
        };

        let borrow = borrow_global_mut<Account_tree>(signer::address_of(caller));
        let i =0;
        let length = vector::length(&borrow.save_4);
        while(i < length){
            let bages = vector::borrow_mut(&mut borrow.save_4,i);
            if(bages.Name == utf8(b"Helper")){
                vector::remove(&mut borrow.save_4,i);
                break
            };
            i = i + 1;
        };
        if(a.save_helper_chance.heler_number !=0){
            a.save_helper_chance.heler_number = a.save_helper_chance.heler_number-1;
        };
    }


    public entry fun quite_helper(caller:&signer) acquires Diffusion_store_tree, ResourceCap, Account_tree {
        let helper_index = check_helper_index(caller);
        assert!(helper_index!=99,NOT_HELPER);
        let borrow = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));
        vector::remove(&mut borrow.save_Helper_list.list,helper_index);
        let helper_resource_Cap = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Helper_Seed)).cap;
        let herlper_resources_signer = create_signer_with_capability(helper_resource_Cap);
        coin::transfer<AptosCoin>(&herlper_resources_signer,signer::address_of(caller),borrow.fee.margin);
        let account = borrow_global_mut<Account_tree>(signer::address_of(caller));
        let i = 0;
        let length = vector::length(&account.save_4);
        while(i < length) {
            let borrow = vector::borrow_mut(&mut account.save_4,i);
            if(borrow.Name == utf8(b"Helper")){
                vector::remove(&mut account.save_4,i);
            };
            i = i+1;
        };
        if(borrow.save_helper_chance.heler_number!=0){
            borrow.save_helper_chance.heler_number = borrow.save_helper_chance.heler_number-1;
        }
    }
    fun all_helper_result(caller:&signer) acquires Diffusion_store_tree {
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list);
        let i =0;
        if (length > (borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.least_helper_result as u64)){
            while(i  < length){
                check_result_right_or_not(caller,i);
                i=i+1;
            }
        }
    }
    fun bbc0(caller:&signer,pair1:string::String) acquires Diffusion_store_tree {
        let i =0 ;
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair);
        while (i < length){
            // let pair = vector::borrow(&borrow_global<Diffusion_store_tree>().save_Pair_result_store.save_pair,i)
            // if(pair.pair_name == pair1){
            //     borrow_global<Diffusion_store_tree>().save_Pair_result_store
            // };
            // i=i+1;
        }
    }
    fun bbc1(caller:&signer ,pair1:string::String):u8 acquires Diffusion_store_tree {
        let i=0;
        let left =0 ;
        let middle = 0;
        let right = 0;
        let major_result = 0;
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list);
        //debug::print(&utf8(b"########################"));
        while(i < length){
            let helper = *vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i);
            // debug::print(&utf8(b"helper adddress"));
            // debug::print(&helper.helper_contribute);
            let (result,index) = helper_pair_choose( helper,pair1);
            // debug::print(&utf8(b"result "));
            // debug::print(&result);
            if(result==1){
                left=left+1;
            }else if(result==2){
                middle = middle +1;
            }else if(result==3){
                right = right +1 ;
            };
            i=i+1;
        };

        // debug::print(&utf8(b"left"));
        // debug::print(&left);
        // debug::print(&utf8(b"middle"));
        // debug::print(&middle);
        // debug::print(&utf8(b"right"));
        // debug::print(&left);
        // debug::print(&utf8(b"########################"));
        if((left+middle+right) >= borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.least_helper_result){
            if (left > middle && left > right) {
                    major_result=1;
            } else if (middle > left && middle >right) {
                    major_result=2;
            } else if (right > left && right > middle) {
                    major_result=3;
            }else{
            }
        }else{
        };
        return major_result
    }
    fun bbc2(caller:&signer ):vector<u8> acquires Diffusion_store_tree {
        let i=0;
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair);
        let vector_major : vector<u8> =vector::empty<u8>();
        while(i < length){
            let pair = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,i);
            let major = bbc1(caller,pair.pair_name);
            if(major ==0){
                vector::push_back(&mut vector_major,0);
            }else if(major ==1){
                vector::push_back(&mut vector_major,1);
            }else if(major ==2){
                vector::push_back(&mut vector_major,2);
            }else if(major ==3){
                vector::push_back(&mut vector_major,3);
            };
            i=i+1;
        };
        // debug::print(&utf8(b"vector_major"));
        // debug::print(&vector_major);

        return vector_major
    }
    fun ggg(caller:&signer,helper:Helper):vector<u64> acquires Diffusion_store_tree {
        let i = 0;
        let length = vector::length(&helper.helper_contribute);
        let vector_cont = vector::empty<u64>();
        while (i < length){
            let contribute = vector::borrow(&helper.helper_contribute,i);
            let index = check_pair_index(caller, contribute.pair.pair_name,contribute.pair.expired_time);
            push_back(&mut vector_cont, index);
            i=i+1;
        };

        return vector_cont
    }

    fun asc(caller: &signer,helper:Helper):vector<u8> {
        let i = 0;
        let length = vector::length(&helper.helper_contribute);
        let return_vector:vector<u8> = vector::empty<u8>();
        while (i < length){
            let borrow = vector::borrow(&helper.helper_contribute,i);

            if(vector::is_empty(&borrow.right_or_not)){
                vector::push_back(&mut return_vector,0);
            }else if(vector::length(&borrow.right_or_not)==2){
                vector::push_back(&mut return_vector,2);
            }else if(vector::length(&borrow.right_or_not)==3){
                vector::push_back(&mut return_vector,3);
            }else if(vector::length(&borrow.right_or_not)==4){
                vector::push_back(&mut return_vector,4);
            };
            i=i+1;
        };
        return return_vector
    }
    fun asc2(caller:&signer):vector<vector<u8>> acquires Diffusion_store_tree {
        let i = 0 ;
        let vector_of_helper: vector<vector<u8>> = vector::empty<vector<u8>>();
        let length = vector::length(
            &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp, Seed)).save_Helper_list.list
        );
        while (i < length) {
            let helper = *vector::borrow(
                &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp, Seed)).save_Helper_list.list,
                i
            );
            let vector_asc = asc(caller, helper);
            // if (vector::is_empty(&vector_asc)) {}else {
            //     vector::push_back(&mut vector_of_helper, vector_asc)
            // };

            vector::push_back(&mut vector_of_helper, vector_asc);
            // debug::print(&utf8(b"vector_asc"));
            // debug::print(&vector_asc);
            i=i+1;
        };
        // debug::print(&utf8(b"vector_of_helper"));
        // debug::print(&vector_of_helper);
        return vector_of_helper
    }
    fun asc3(caller:&signer) acquires Diffusion_store_tree {

        let vector_a = asc2(caller);
        // debug::print(&utf8(b" asc2  "));
        // debug::print(&vector_a);

        let i = 0 ;

        let length = vector::length(&vector_a);
        // debug::print(&utf8(b"length of vector_a"));
        // debug::print(&length);
        let major_result_vector = bbc2(caller);
        // debug::print(&utf8(b"major_result_vector"));
        // debug::print(&major_result_vector);

        while( i < length ){
                let f = 0 ;
                let first_helper = vector::borrow(&vector_a,i);
                let length_of_helper = vector::length(first_helper);  // length of first helper contribute
                let helper_pair = ggg(caller,*vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i));

                    while (f < length_of_helper) {
                        if(vector::is_empty(first_helper)){

                        }else {

                            let helper_contrivute_done = vector::borrow(first_helper, f);

                            if (vector::is_empty(&helper_pair)) {}else {
                                let major = vector::borrow(&major_result_vector, *vector::borrow(&helper_pair, f));
                                let admin_set =  vector::borrow(& borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,*vector::borrow(&helper_pair, f));

                                if(admin_set == &true ){
                                    if(vector::borrow(& borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,*vector::borrow(&helper_pair, f)) != major){
                                        if (helper_contrivute_done == &0) {
                                            vector::push_back(
                                                &mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,
                                                false
                                            );
                                            vector::push_back(
                                                &mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,
                                                false
                                            );
                                        }else if(helper_contrivute_done == &2){


                                            if (vector::borrow(
                                                &vector::borrow(
                                                    &borrow_global<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_contribute,
                                                f
                                            ).result != *vector::borrow(
                                                &borrow_global<Diffusion_store_tree>(
                                                    create_resource_address(&@dapp, Seed)
                                                ).save_Pair_result_store.save_result,
                                                *vector::borrow(&helper_pair, f)
                                            )) {
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point = vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point + 1;
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                            }else {
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times = vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times + 1;
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    false
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                            }

                                        }else if(helper_contrivute_done == &3){
                                            // debug::print(&utf8(b" true or false"));
                                            // debug::print(&vector::borrow_mut(
                                            //     &mut vector::borrow_mut(
                                            //         &mut borrow_global_mut<Diffusion_store_tree>(
                                            //             create_resource_address(&@dapp, Seed)
                                            //         ).save_Helper_list.list,
                                            //         i
                                            //     ).helper_contribute,
                                            //     f
                                            // ).right_or_not);
                                            if(vector::borrow_mut (&mut vector::borrow_mut(
                                                &mut vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_contribute,
                                                f
                                            ).right_or_not,1) == &true){
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point=vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point-1;
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times=vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times+1;

                                                vector::pop_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not);
                                                vector::pop_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not);
                                                vector::push_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,false);
                                                vector::push_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,true);
                                                vector::push_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,true);
                                            }else if (vector::borrow_mut (&mut vector::borrow_mut(
                                                &mut vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_contribute,
                                                f
                                            ).right_or_not,1) == &false){
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times=vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times-1;
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point=vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point+1;
                                                vector::pop_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not);
                                                vector::pop_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not);
                                                vector::push_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,true);
                                                vector::push_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,true);
                                                vector::push_back(&mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,true);
                                            }
                                        }else if(helper_contrivute_done == &4){
                                            //debug::print(&utf8(b"4444 true or false"));

                                        }
                                    }else {
                                        if (helper_contrivute_done == &0) {
                                            vector::push_back(
                                                &mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,
                                                false
                                            );
                                            vector::push_back(
                                                &mut vector::borrow_mut(
                                                    &mut vector::borrow_mut(
                                                        &mut borrow_global_mut<Diffusion_store_tree>(
                                                            create_resource_address(&@dapp, Seed)
                                                        ).save_Helper_list.list,
                                                        i
                                                    ).helper_contribute,
                                                    f
                                                ).right_or_not,
                                                false
                                            );
                                        }else if (helper_contrivute_done == &2) {
                                            if (vector::borrow(
                                                &vector::borrow(
                                                    &borrow_global<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_contribute,
                                                f
                                            ).result == *vector::borrow(
                                                &borrow_global<Diffusion_store_tree>(
                                                    create_resource_address(&@dapp, Seed)
                                                ).save_Pair_result_store.save_result,
                                                *vector::borrow(&helper_pair, f)
                                            )) {
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point = vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point + 1;
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                            }else {
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times = vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times + 1;
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    false
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                            }
                                        }else if (helper_contrivute_done == &3) {};
                                    }
                                }else {
                                    if (helper_contrivute_done == &0) {
                                        vector::push_back(
                                            &mut vector::borrow_mut(
                                                &mut vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_contribute,
                                                f
                                            ).right_or_not,
                                            false
                                        );
                                        vector::push_back(
                                            &mut vector::borrow_mut(
                                                &mut vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_contribute,
                                                f
                                            ).right_or_not,
                                            false
                                        );
                                    }else if (helper_contrivute_done == &2) {
                                        if (major == &0) {}else {
                                            if (vector::borrow(
                                                &vector::borrow(
                                                    &borrow_global<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_contribute,
                                                f
                                            ).result == *major) {
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point = vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).helper_point + 1;
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                            }else {
                                                vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times = vector::borrow_mut(
                                                    &mut borrow_global_mut<Diffusion_store_tree>(
                                                        create_resource_address(&@dapp, Seed)
                                                    ).save_Helper_list.list,
                                                    i
                                                ).wrong_times + 1;
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::pop_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    false
                                                );
                                                vector::push_back(
                                                    &mut vector::borrow_mut(
                                                        &mut vector::borrow_mut(
                                                            &mut borrow_global_mut<Diffusion_store_tree>(
                                                                create_resource_address(&@dapp, Seed)
                                                            ).save_Helper_list.list,
                                                            i
                                                        ).helper_contribute,
                                                        f
                                                    ).right_or_not,
                                                    true
                                                );
                                            }

                                        }
                                    }
                                    else if (helper_contrivute_done == &3) {};
                                }
                            } ;
                        };
                        f = f + 1;
                    };
            i = i+1;
        };
    }

        ///top//
    fun check_result_right_or_not(caller: &signer, specfic_helper_index: u64) acquires Diffusion_store_tree {
            // let (length,borrow_help) = length_of_helper_contrribute(caller,specfic_helper_index);
           // let borrow = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));
           // let copy_helper = vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index);
            let length = vector::length(& vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_contribute);
            let i =0;
            let f:u64 = 0;
            while (i < length){
                let pair1 = *vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_contribute,i);
                let (major_result,need_admin,most_helper_left,most_helper_middle,most_helper_right,vector_of_contribute)=most_helper_result(caller,pair1.pair.pair_name, borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)));
                let real_pair_index = check_pair_index_without_borrow_version(caller,pair1.pair.pair_name);
                //let real_pair = vector::borrow(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,real_pair_index);
                // debug::print(&utf8(b"left"));
                // debug::print(&most_helper_left);
                // debug::print(&utf8(b"middle"));
                // debug::print(&most_helper_middle);
                // debug::print(&utf8(b"right"));
                // debug::print(&most_helper_right);


                // i for specfic helper contribute

                // debug::print(&utf8(b"list length"));
                // debug::print(&vector::length(&borrow.save_Helper_list.list));
                // debug::print(&utf8(b"vector_of_contribute length"));
                // debug::print(&vector::length(&vector_of_contribute));
                if((most_helper_left+most_helper_middle+most_helper_right) >=  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.least_helper_result){
                    // while(f < ((most_helper_left+most_helper_middle+most_helper_right)as u64)){
                    while(f < vector::length(&vector_of_contribute)){
                        //let specfic_helper = vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f);
                        //debug::print(&utf8(b"helper"));
                       // debug::print(&specfic_helper.account);
                       //  debug::print(&utf8(b"specfic_helper wrong time"));
                       //  debug::print(&specfic_helper.wrong_times);

                        let index_of_vector_contribute = vector::borrow(& vector_of_contribute,f);
                        // debug::print(&utf8(b"index_of_vector_contribute"));
                        // debug::print(index_of_vector_contribute);
                        if(vector::is_empty(&vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute)){
                        }else{

                           //let specfic_right_or_not = vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute);
                            if(vector::is_empty(&vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not)){
                                vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,false);
                                vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,false);
                            }else if(vector::length(&vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not )==2){
                                if(major_result !=0 && need_admin != true){
                                    //debug::print(&utf8(b"major_result !=0 && need_admin != true"));

                                    let store_pair_index=check_pair_index_without_borrow_version(caller,pair1.pair.pair_name);
                                    let vector_admin_set_result_store = vector::borrow( & borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,store_pair_index);
                                    if( vector_admin_set_result_store == &true){
                                       // debug::print(&utf8(b"vector_admin_set_result_store == &true"));
                                        let real_result = *vector::borrow(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,store_pair_index);
                                        if(&real_result == vector::borrow(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,real_pair_index)){
                                            vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_point= vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_point+1;
                                            vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_point=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_point+1;
                                            vector::pop_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not);
                                            vector::pop_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not);
                                            vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                            vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                            vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                        }else if(&real_result != vector::borrow(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,real_pair_index)){
                                            vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).wrong_times= vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).wrong_times+1;
                                            vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).wrong_times=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).wrong_times+1;
                                            vector::pop_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not);
                                            vector::pop_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not);
                                            vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                            vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,false);
                                            vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                        }
                                    }else if(vector_admin_set_result_store == &false){
                                       // debug::print(&utf8(b"major_result"));
                                       //  debug::print(&major_result);
                                            if(major_result == vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).result){
                                                vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_point= vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_point+1;
                                                vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_point=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_point+1;

                                                vector::pop_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not);
                                                vector::pop_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not);
                                                vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                                vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                                vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                            }else if(major_result != vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).result){
                                                vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).wrong_times= vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).wrong_times+1;
                                                vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).wrong_times=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).wrong_times+1;
                                                vector::pop_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not);
                                                vector::pop_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not);
                                                vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                                vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,false);
                                                vector::push_back(&mut vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not,true);
                                            }

                                    };
                                    if((vector::length(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list)) >= ( borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.least_helper_result as u64)){

                                        let b = vector::borrow(&  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,store_pair_index);
                                        b= &major_result;
                                    }
                                }else{};

                            }else if(vector::length(&vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).right_or_not )==3){
                                let store_pair_index=check_pair_index_without_borrow_version(caller,pair1.pair.pair_name);
                                let vector_admin_set_result_store = vector::borrow( & borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,store_pair_index);
                                if( vector_admin_set_result_store == &true){
                                    // debug::print(&utf8(b"vector_admin_set_result_store == &true"));
                                    let result = *vector::borrow(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,real_pair_index);
                                    let real_result = *vector::borrow(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,store_pair_index);
                                    if(real_result == result ){
                                        vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_point=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_point+1;
                                        vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_point=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_point+1;
                                    }else if(real_result != result){
                                        vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).wrong_times=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).wrong_times+1;
                                        vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).wrong_times=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).wrong_times+1;
                                    }
                                }else if(vector_admin_set_result_store == &false){
                                    // debug::print(&utf8(b"major_result"));
                                    //  debug::print(&major_result);
                                    if(major_result == vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).result){
                                        vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_point=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).helper_point+1;
                                        vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_point=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_point+1;
                                    }else if(major_result != vector::borrow_mut(&mut vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).helper_contribute,*index_of_vector_contribute).result){
                                        vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).wrong_times=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,specfic_helper_index).wrong_times+1;
                                        vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).wrong_times=vector::borrow_mut(&mut  borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,f).wrong_times+1;
                                    }

                                };
                            }
                        };
                        f=f+1;
                    };
                };
                i=i+1;
            };
            // let a = Helper{
            //     account:copy_helper.account,
            //     helper_contribute:copy_helper.helper_contribute,
            //     helper_point:copy_helper.helper_point,
            //     upload_times:copy_helper.upload_times,
            //     wrong_times:copy_helper.wrong_times,
            //     pay_margin:copy_helper.pay_margin,
            //     need_admin:copy_helper.need_admin
            // };

          // vector::remove(&mut borrow.save_Helper_list.list,specfic_helper_index);
          // vector::push_back(&mut borrow.save_Helper_list.list,a);



    }
    fun check_pair_index_without_borrow_version(caller:&signer,pair_name1:string::String):u64 acquires Diffusion_store_tree {
        let i =0 ;
        let length_pair_vector = vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair);
        while(i < length_pair_vector){
            let borrow_specfic_pair = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,i);
            if ( borrow_specfic_pair.pair_name == pair_name1 ){
                return i
            };
            i=i+1;
        };
        return 99
    }
    fun length_of_helper_contrribute(caller:&signer, specfic_helper_index: u64):(u64,Helper) acquires Diffusion_store_tree {
        let borrow = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));
        let borrow_help = vector::borrow(&borrow.save_Helper_list.list,specfic_helper_index);
        let length = vector::length(&borrow_help.helper_contribute);
        (length,*borrow_help)
    }
    fun most_helper_result(caller:&signer,pair_name1:string::String,borrow:&mut Diffusion_store_tree):(u8,bool,u8,u8,u8,vector<u64>) {
        let (left,middle,right,vector_of_contribute) = helper_amount_choose(caller,pair_name1,borrow);
        let majority_result = 0;
        // debug::print(&utf8(b"left"));
        // debug::print(&left);
        // debug::print(&utf8(b"middle"));
        // debug::print(&middle);
        // debug::print(&utf8(b"right"));
        // debug::print(&right);
        if((left+middle+right) >= borrow.save_helper_chance.least_helper_result){
            if (left > middle && left > right) {
                majority_result = 1;
                return (majority_result,false,left,middle,right,vector_of_contribute)
            } else if (middle > left && middle >right) {
                majority_result = 2;
                return (majority_result,false,left,middle,right,vector_of_contribute)
            } else if (right > left && right > middle) {
                majority_result = 3;
                return (majority_result,false,left,middle,right,vector_of_contribute)
            }else{
                return (majority_result,true,left,middle,right,vector_of_contribute)
            }
        }else{
            return (majority_result,true,left,middle,right,vector_of_contribute)
        }
    }

    fun helper_pair_choose(helper1:Helper,pair_name1:string::String):(u8,u64){
        let i=0;
        let length = vector::length(&helper1.helper_contribute);
        while(i < length ){
            let borrow = vector::borrow_mut(&mut helper1.helper_contribute,i);

            if(borrow.pair.pair_name==pair_name1){

                return (borrow.result,i)
            };
            i=i+1;
        };
        return (99,99)
    }
    fun helper_amount_choose(caller:&signer,pair_name1:string::String,borrow:&mut Diffusion_store_tree):(u8,u8,u8,vector<u64>)  {
        // let borrow = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp, Seed));
        let length_of_helper = vector::length(&borrow.save_Helper_list.list);
        let i = 0 ; //helper amount
        let  left = 0;
        let  middle = 0;
        let  right = 0;
        let index :vector<u64> = vector::empty<u64>();
        while(i < length_of_helper ){
            let helper = *vector::borrow(&borrow.save_Helper_list.list,i);
            // debug::print(&utf8(b"helper1"));
            // debug::print(&helper);
            let (choose1,index_1) = helper_pair_choose(helper,pair_name1);
            // debug::print(&utf8(b"choose1"));
            // debug::print(&choose1);
            if ( choose1 == 1){
                left=left+1;
                push_back(&mut index,index_1);
            }else if(choose1 == 2){
                middle=middle+1;
                push_back(&mut index,index_1);
            }else if(choose1 == 3){
                right=right+1;
                push_back(&mut index,index_1);
            }else{

            };
            // debug::print(&utf8(b"left"));
            // debug::print(&left);
            // debug::print(&utf8(b"middle"));
            // debug::print(&middle);
            // debug::print(&utf8(b"right"));
            // debug::print(&right);
            i=i+1;
        };

        return  (left,middle,right,index)
    }




    fun check_helper_index(caller:&signer):u64 acquires  Diffusion_store_tree {
        let i =0;
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list);

        while(i < length ){

            if(vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i).account == signer::address_of(caller)){
                return i
            };
            i=i+1;
        };
        return 99
    }
    fun check_helper_upload_result_index(caller:&signer,pair_index:u64,helper_index:u64):u64 acquires  Diffusion_store_tree {
        let i = 0;
        let borrow_helper_list = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list;
        let borrow_specfic_helper = vector::borrow(&borrow_helper_list,helper_index);
        let length_helper_upload_result = vector::length(&borrow_specfic_helper.helper_contribute);

        let borrow_specfic_pair = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair;
        let borrow_right_pair = vector::borrow(&borrow_specfic_pair,pair_index);



        while(i < length_helper_upload_result){
            let borrow_specfic_helper_result = vector::borrow(&borrow_specfic_helper.helper_contribute,i);
            if(borrow_specfic_helper_result.pair.pair_name == borrow_right_pair.pair_name){
                return  i
            };
            i=i+1;
        };
        return 99
    }


    fun check_pair_index(caller:&signer,pair_name1:string::String,expire_time:u64):u64 acquires  Diffusion_store_tree {
        let i =0 ;
        let borrow_pair_result = &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store;
        let length_pair_vector = vector::length(&borrow_pair_result.save_pair);

        while(i < length_pair_vector){
            let borrow_specfic_pair = vector::borrow(&borrow_pair_result.save_pair,i);
            if ( borrow_specfic_pair.pair_name == pair_name1 ){
                if(borrow_specfic_pair.expired_time==expire_time){
                    return i
                }
            };
            i=i+1;
        };
        return 99

    }



    fun pay_margin_to_account(caller:&signer) acquires Diffusion_store_tree {
        let borrow_mergin =borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.margin;
        coin::deposit(create_resource_address(&@dapp,Helper_Seed), coin::withdraw<AptosCoin>(caller,borrow_mergin));
    }


    fun share_to_allocation(caller:&signer,pair1:string::String,expire_time:u64) acquires Diffusion_store_tree, ResourceCap {
        let resource_signer = create_signer_with_capability(&borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap);
        let pair_index = check_pair_index(caller,pair1,expire_time);

        let share1 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.allocation_share_1;
        let share2 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.allocation_share_2;

        let bank_share1 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.bank_share_1;
        let bank_share2 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.bank_share_2;

        let helper_number = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.heler_number;

       // let allocation = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.period;

        let total_give = (vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,pair_index).right+vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,pair_index).middle+vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,pair_index).left-vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,pair_index).given);
        if(total_give!=0){
            let budget = (total_give*share1)/share2;
            let bank_budget = (total_give*bank_share1)/bank_share2;

            transfer<AptosCoin>(&resource_signer,create_resource_address(&@dapp,Bank_Seed),bank_budget);

            let pair=vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,pair_index);
            let new_allocation = Helper_allocation{
                pair:Pair{
                    pair_type:pair.pair_type,
                    pair_name:pair.pair_name,
                    left_url:pair.left_url,
                    right_url:pair.right_url,
                    left:pair.left,
                    left2:pair.left2,
                    middle:pair.middle,
                    middle2:pair.middle2,
                    right:pair.right,
                    right2:pair.right2,
                    can_bet:pair.can_bet,
                    expired_time:pair.expired_time}  ,
                allocation: budget,
                time_period:utf8(b""),
                ended:false
            };
            vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.period,new_allocation);
            let each_person_share = budget/helper_number;
            let allocation_index = check_allocation_index(caller,pair1);
            if(allocation_index!=99){
                if(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.period,allocation_index).ended== false){
                    start_share_to_helper(caller,each_person_share,pair1,expire_time);
                    vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.period,allocation_index).ended = true;
                };
            };
        }

    }
    fun check_allocation_index(caller:&signer,pair1:string::String):u64 acquires Diffusion_store_tree {
        let i = 0 ;
        let length =  vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.period);
        while(i < length){
            let specfic = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.period,i);
            if(specfic.pair.pair_name == pair1){
                return i
            };
            i=i+1;
        };
        return 99
    }
    fun check_vector_is_zero(input1:&vector<address>,input2:&vector<u64>):(bool,bool){
        let i = 0 ;
        let count_adddress =0 ;
        let count_amount = 0;
        let length = vector::length(input1);
        while(i < length){
            let borrow_address = vector::borrow(input1,i);
            let borrow_amount = vector::borrow(input2,i);
            if(borrow_address != &create_resource_address(&@dapp,Garble_Seed)){
                count_adddress=count_adddress+1;
            };
            if(borrow_amount != &0){
                count_amount=count_amount+1;
            };

            i=i+1
        };
        if(count_amount == length && count_adddress ==length ){
            return (true,true)
        };
        return (false,false)
    }
    fun start_share_to_helper(caller:&signer,each_person_share:u64,pair1:string::String,expired_time:u64) acquires Diffusion_store_tree, ResourceCap {
        assert!(each_person_share !=0 ,Input_ammmount_cant_be_zero);
        let resources_signer = create_signer_with_capability(&borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap);
        let share_vector:vector<u64> =vector::empty<u64>();
        let i = 0;

            let address_vector = find_helper_share(caller ,pair1,expired_time);
            let length = vector::length(&address_vector);


            if(length != 0){
                while(i < length) {
                    if (each_person_share != 0) {
                        vector::push_back(&mut share_vector, each_person_share);
                        i = i + 1;
                    };
                };
                // debug::print(&utf8(b"length of share vector"));
                // debug::print(&vector::length(&share_vector));
                // debug::print(&utf8(b"length of address vector"));
                // debug::print(&vector::length(&address_vector));
                let (state1,state2) = check_vector_is_zero(&address_vector,&share_vector);
                    if(vector::is_empty(&share_vector) == true){
                    }else {
                        if (vector::is_empty(&address_vector) == true) {
                        }else {
                            if(state1 == true){
                                if(state2 == true){
                                    assert!(vector::length(&share_vector) == vector::length(&address_vector) ,Iuput_of_length_not_same);
                                    batch_transfer(&resources_signer,address_vector,share_vector)
                                }
                            }
                        }
                    };


        };
    }

    fun find_helper_share(caller:&signer,pair1:string::String,expired_time:u64):vector<address> acquires Diffusion_store_tree {
        asc3(caller);
        let vector_helper = vector::empty<address>();
        let i = 0 ;
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list);
        while(i < length){
            let f = 0;
            let length = vector::length(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i).helper_contribute);
            while(f < length ){
                let specfic_contribute_name = vector::borrow(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i).helper_contribute,f).pair.pair_name;
                let helper_choose  =vector::borrow(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i).helper_contribute,f).result;
                let pair_index = check_pair_index(caller,pair1,expired_time);
                let real_result = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,pair_index);
                let helper_address = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i).account;
                let helper_contribute_index = allocation_check_helper_contribute(caller,pair1,vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i) );
                let helper_right_or_not = vector::borrow(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i).helper_contribute,f).right_or_not;

                if (vector::borrow(&vector::borrow(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,i).helper_contribute,f).right_or_not,1) == &true) {
                    if (specfic_contribute_name == pair1) {
                        if (&helper_choose == real_result) {
                            assert!(helper_address != create_resource_address(&@dapp,Garble_Seed),Input_of_share_equal_to_resoures_address);

                                vector::push_back(&mut vector_helper, helper_address);

                            // if(helper_address!=signer::address_of(caller)){
                            //     vector::push_back(&mut vector_helper, helper_address);
                            // }
                        }
                    };
                };
                f=f+1;
            };
            i=i+1;
        };
        return vector_helper
    }
    fun allocation_check_helper_contribute(caller:&signer,pair1:String,helper:&Helper):u64{
        let i = 0 ;
        let length = vector::length(&helper.helper_contribute);
        while(i < length ){
            let borrow= vector::borrow(&helper.helper_contribute,i);
            if(borrow.pair.pair_name == pair1){
                return i
            };
            i=i+1;
        };
        return 99
    }

    ////////////////// Logic fun /////////////////////////////////


    ////////////////// Init fun /////////////////////////////////

    // fun init_module (caller:&signer){
    //     assert!(!exists<ResourceCap>(signer::address_of(caller)),RESOUREC_already_exist);
    //     let (garble_Seed_resource_signer, garble_resource_cap) = account::create_resource_account(
    //         caller,
    //         Garble_Seed
    //     );
    //     let (helper_resource_signer, helper_resource_cap) = account::create_resource_account(
    //         caller,
    //         Helper_Seed
    //     );
    //     let (bank_resource_signer, bank_resource_cap) = account::create_resource_account(
    //         caller,
    //         Bank_Seed
    //     );
    //     let (resource_signer, resource_cap) = account::create_resource_account(
    //         caller,
    //         Seed
    //     );
    //     assert!(!exists<ResourceCap>(address_of(&resource_signer)),RESOUREC_already_exist);
    //     move_to(&garble_Seed_resource_signer, ResourceCap { cap:garble_resource_cap });
    //     move_to(&helper_resource_signer,ResourceCap{cap:helper_resource_cap});
    //     move_to(&bank_resource_signer,ResourceCap{cap:bank_resource_cap});
    //     move_to(&resource_signer,ResourceCap{cap:resource_cap});
    //     let diffusion_tree   = Diffusion_store_tree{
    //         save_Pair_result_store:Pair_result_store{
    //             save_admin_set_result:vector::empty<bool>(),
    //             save_can_claim:vector::empty<bool>(),
    //             save_result:vector::empty<u8>(),
    //             save_pair:vector::empty<Pair>(),
    //             save_chips:vector::empty<Chips>()
    //         },
    //         save_Helper_list:Helper_list{
    //             list:vector::empty<Helper>(),
    //             period:vector::empty<Helper_allocation>()
    //         },
    //         fee:Diffusion_fee{
    //             margin:500000000,
    //             fees_1:3,
    //             fees_2:100,
    //             allocation_share_1:10,
    //             allocation_share_2:100,
    //             bank_share_1:20,
    //             bank_share_2:100
    //         },
    //         save_helper_chance:Chance{
    //             maximun_helper_num:1000,
    //             heler_number:4,
    //             least_helper_result:4,
    //             chance_for_wrong_time:10
    //         },
    //         save_Cylinder_Pairs:vector::empty()
    //     };
    //     move_to(&resource_signer,diffusion_tree);
    //     register<AptosCoin>(&resource_signer);
    //     register<AptosCoin>(&helper_resource_signer);
    //     register<AptosCoin>(&bank_resource_signer);
    //     register<AptosCoin>(&garble_Seed_resource_signer);
    // }

    ////////////////// Init fun /////////////////////////////////

    ////////////////// Test fun /////////////////////////////////

    #[test(aptos_framework=@aptos_framework,caller=@dapp,admin=@admin1,user1=@0x1111,user2=@0x2222,user3=@0x3333,target1=@0x101010,target2=@0x202020,target3=@0x303030)]
    fun test_single_cylinder_coin_transfer(aptos_framework:&signer,caller:&signer,admin:&signer,user1:&signer,user2:&signer,user3:&signer,target1:&signer,target2:&signer,target3:&signer) acquires Diffusion_store_tree, ResourceCap, Account_tree {
        let apt_mint_cap= prepare_test(aptos_framework,caller);
        init_module(caller);
        prepare_user_account_for_test(admin,&apt_mint_cap);
        prepare_user_account_for_test(user1,&apt_mint_cap);
        prepare_user_account_for_test(user2,&apt_mint_cap);
        prepare_user_account_for_test(user3,&apt_mint_cap);
        prepare_user_account_for_test(target1,&apt_mint_cap);
        prepare_user_account_for_test(target2,&apt_mint_cap);
        prepare_user_account_for_test(target3,&apt_mint_cap);
        coin::deposit(create_resource_address(&@dapp,Seed),coin::mint(2000000000,&apt_mint_cap));
        coin::deposit(create_resource_address(&@dapp,Garble_Seed),coin::mint(2000000000,&apt_mint_cap));
        coin::destroy_mint_cap(apt_mint_cap);

        create_account_tree(user1,utf8(b"user1"),utf8(b"aaaa"));
        create_account_tree(user2,utf8(b"user2"),utf8(b"aaaa"));
        create_account_tree(user3,utf8(b"user3"),utf8(b"aaaa"));


        let (burn_cap,froz_cap,mint_cap)=coin::initialize<Diffusion_coin>(caller,utf8(b"dfp"),utf8(b"dfp"),8,false);
        coin::register<Diffusion_coin>(user1);
        coin::register<Diffusion_coin>(user2);
        coin::deposit(signer::address_of(user1),coin::mint(5000000000,&mint_cap));
        coin::deposit(signer::address_of(user2),coin::mint(5000000000,&mint_cap));
        coin::destroy_mint_cap(mint_cap);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_freeze_cap(froz_cap);

        create_cylinder(admin,utf8(b"dfp"),@dapp,100000000);

        //set_cylinder_sav_number(admin,2,utf8(b"dfp"),@0x1,100000000);

        reload_single<Diffusion_coin,AptosCoin>(user1,false,false,100000000,signer::address_of(target1),utf8(b"dfp"),@dapp,100000000);
      //  reload_single<Diffusion_coin,AptosCoin>(user2,false,true,100000000,signer::address_of(target2),utf8(b"dfp"),@dapp,100000000);

        // debug::print(&utf8(b" 1 balance of garble resource ::"));
        // debug::print(&balance<Diffusion_coin>(create_resource_address(&@dapp,Garble_Seed)));
        // debug::print(&utf8(b" 1 balancce of user1::"));
        // debug::print(&balance<Diffusion_coin>(signer::address_of(user1)));
        // debug::print(&utf8(b" 1 balancce of target1::"));
        // debug::print(&balance<Diffusion_coin>(signer::address_of(target1)));
        // debug::print(&utf8(b" 1 balance of resource ::"));
        // debug::print(&balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
        // debug::print(&utf8(b" 1 balance of garble resource ::"));
        // debug::print(&balance<AptosCoin>(create_resource_address(&@dapp,Garble_Seed)));
        // debug::print(&utf8(b" 1 balancce of user1::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user1)));
        // debug::print(&utf8(b" 1 balancce of user2::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user2)));
        // debug::print(&utf8(b" 1 balancce of user3::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user3)));
        // debug::print(&utf8(b" 1 balancce of target1::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(target1)));
        // debug::print(&utf8(b" 1 balancce of target2::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(target2)));
        // debug::print(&utf8(b" 1 balancce of target3::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(target3)));
        // debug::print(&utf8(b" 1 balance of admin ::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(admin)));
    }

    #[test(aptos_framework=@aptos_framework,caller=@dapp,admin=@admin1,user1=@0x1111,user2=@0x2222,user3=@0x3333,target1=@0x101010,target2=@0x202020,target3=@0x303030)]
    fun test_single_cylinder_apt_transfer(aptos_framework:&signer,caller:&signer,admin:&signer,user1:&signer,user2:&signer,user3:&signer,target1:&signer,target2:&signer,target3:&signer) acquires Diffusion_store_tree, ResourceCap, Account_tree {
        let apt_mint_cap= prepare_test(aptos_framework,caller);
        init_module(caller);
        prepare_user_account_for_test(admin,&apt_mint_cap);
        prepare_user_account_for_test(user1,&apt_mint_cap);
        prepare_user_account_for_test(user2,&apt_mint_cap);
        prepare_user_account_for_test(user3,&apt_mint_cap);
        prepare_user_account_for_test(target1,&apt_mint_cap);
        prepare_user_account_for_test(target2,&apt_mint_cap);
        prepare_user_account_for_test(target3,&apt_mint_cap);
        coin::deposit(create_resource_address(&@dapp,Seed),coin::mint(2000000000,&apt_mint_cap));
        coin::deposit(create_resource_address(&@dapp,Garble_Seed),coin::mint(2000000000,&apt_mint_cap));
        coin::destroy_mint_cap(apt_mint_cap);

        create_account_tree(user1,utf8(b"user1"),utf8(b"aaaa"));
        create_account_tree(user2,utf8(b"user2"),utf8(b"aaaa"));
        create_account_tree(user3,utf8(b"user3"),utf8(b"aaaa"));

        create_cylinder(admin,utf8(b"APT"),@0x1,100000000);

       //reload_single<AptosCoin,AptosCoin>(user1,false,false,100000000,signer::address_of(target1),utf8(b"APT"),@0x1,100000000);
        set_cylinder_sav_number(admin,2,utf8(b"APT"),@0x1,100000000);
        reload_single<AptosCoin,AptosCoin>(user1,false,true,100000000,signer::address_of(target1),utf8(b"APT"),@0x1,100000000);
        reload_single<AptosCoin,AptosCoin>(user2,false,true,100000000,signer::address_of(target2),utf8(b"APT"),@0x1,100000000);
        //reload_single<AptosCoin,AptosCoin>(user3,false,true,100000000,signer::address_of(target3),utf8(b"APT"),@0x1,100000000);

        // debug::print(&utf8(b"diffusion type info"));
        // debug::print(&type_info::type_of<Diffusion_coin>());
        // debug::print(&utf8(b"diffusion module name"));
        // debug::print(&type_info::type_name<Diffusion_coin>());
        // debug::print(&utf8(b"diffusion module name"));
        // debug::print(&type_info::module_name(&type_info::type_of<Diffusion_coin>()));
        // debug::print(&utf8(b"diffusion struct name"));
        // debug::print(&type_info::struct_name(&type_info::type_of<Diffusion_coin>()));


        // debug::print(&utf8(b" 1 balance of resource ::"));
        // debug::print(&balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
        // debug::print(&utf8(b" 1 balance of garble resource ::"));
        // debug::print(&balance<AptosCoin>(create_resource_address(&@dapp,Garble_Seed)));
        // debug::print(&utf8(b" 1 balancce of user1::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user1)));
        // debug::print(&utf8(b" 1 balancce of user2::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user2)));
        // debug::print(&utf8(b" 1 balancce of user3::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user3)));
        // debug::print(&utf8(b" 1 balancce of target1::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(target1)));
        // debug::print(&utf8(b" 1 balancce of target2::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(target2)));
        // debug::print(&utf8(b" 1 balancce of target3::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(target3)));
        // debug::print(&utf8(b" 1 balance of admin ::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(admin)));
    }
    #[test(aptos_framework=@aptos_framework,caller=@dapp,admin=@admin1,user1=@0x11223,user2=@0x02333333,helper1=@0x555,helper2=@0x666,helper3=@0x777,helper4=@0x888,helper5=@0x9999,helper6=@0x101010)]
    fun test_quit_helper(aptos_framework:&signer,caller:&signer,admin:&signer,user1:&signer,user2:&signer,helper1:&signer,helper2:&signer,helper3:&signer,helper4:&signer,helper5:&signer,helper6:&signer) acquires Diffusion_store_tree, Account_tree, ResourceCap {
        let apt_mint_cap= prepare_test(aptos_framework,caller);
        init_module(caller);
        prepare_user_account_for_test(admin,&apt_mint_cap);
        prepare_user_account_for_test(user1,&apt_mint_cap);
        prepare_user_account_for_test(user2,&apt_mint_cap);
        prepare_user_account_for_test(helper1,&apt_mint_cap);
        prepare_user_account_for_test(helper2,&apt_mint_cap);
        prepare_user_account_for_test(helper3,&apt_mint_cap);
        prepare_user_account_for_test(helper4,&apt_mint_cap);
        prepare_user_account_for_test(helper5,&apt_mint_cap);
        prepare_user_account_for_test(helper6,&apt_mint_cap);
        coin::deposit(create_resource_address(&@dapp,Seed),coin::mint(2000000000,&apt_mint_cap));
        coin::deposit(create_resource_address(&@dapp,Helper_Seed),coin::mint(2000000000,&apt_mint_cap));
        coin::destroy_mint_cap(apt_mint_cap);

        set_chance(admin,utf8(b"wrong"),1,0);
        set_chance(admin,utf8(b"least helper"),3,0);

        create_pair(admin,utf8(b"mmm"),110,100,200,100,130,100,300,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"trump vs bai"),102,100,800,100,3600,100,300,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"me vs you"),300,100,200,100,500,100,4600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"hello vs bye"),400,100,300,100,200,100,3600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"love me vs you"),200,100,110,100,600,100,8600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"iphone vs android"),200,100,300,100,200,100,2600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"aptos vs sol"),300,100,110,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"sss vs ddd"),200,100,300,100,200,100,2600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"bbb vs sss"),300,100,110,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"ssd"),200,100,300,100,200,100,2600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"sdv"),300,100,110,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"abc"),200,100,300,100,200,100,2600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"dsc"),400,100,140,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"asd"),350,100,150,100,390,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"csd"),320,100,170,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));

        create_account_tree(user1,utf8(b"user1"),utf8(b"aaaa"));
        create_account_tree(user2,utf8(b"user2"),utf8(b"bbbb"));
        create_account_tree(helper1,utf8(b"helper1"),utf8(b"helper1"));
        create_account_tree(helper2,utf8(b"helper2"),utf8(b"helper2"));
        create_account_tree(helper3,utf8(b"helper3"),utf8(b"helper3"));
        create_account_tree(helper4,utf8(b"helper4"),utf8(b"helper4"));
        create_account_tree(helper5,utf8(b"helper5"),utf8(b"helper5"));
        create_account_tree(helper6,utf8(b"helper6"),utf8(b"helper6"));

        create_bet_card(user1,100000000,1200,2,utf8(b"mmm"),300);
        //debug::print(&utf8(b"bet amount"));
       // debug::print(&borrow_global<Account_tree>(signer::address_of(user1)).save_2);
        create_bet_card(user1,100000000,1200,2,utf8(b"mmm"),300);
        //debug::print(&utf8(b"2bet amount"));
        //debug::print(&borrow_global<Account_tree>(signer::address_of(user1)).save_2);
        create_bet_card(user2,300000000,1200,3,utf8(b"mmm"),300);
        create_bet_card(helper2,200000000,1200,3,utf8(b"mmm"),300);
        create_bet_card(helper1,200000000,1200,3,utf8(b"mmm"),300);

        create_helper(admin,utf8(b"add"),signer::address_of(helper1));
        create_helper(admin,utf8(b"add"),signer::address_of(helper2));
        create_helper(admin,utf8(b"add"),signer::address_of(helper3));
        create_helper(admin,utf8(b"add"),signer::address_of(helper4));
        create_helper(admin,utf8(b"add"),signer::address_of(helper5));
        create_helper(admin,utf8(b"add"),signer::address_of(helper6));

        apply_to_be_helper(helper1);
        apply_to_be_helper(helper2);
        apply_to_be_helper(helper3);
        apply_to_be_helper(helper4);
        apply_to_be_helper(helper5);
        apply_to_be_helper(helper6);

        admin_said_times_up(admin,utf8(b"mmm"),300);

        helper_upload_result(helper1,utf8(b"mmm"),1,300);
        helper_upload_result(helper2,utf8(b"mmm"),2,300);
        helper_upload_result(helper3,utf8(b"mmm"),3,300);
        helper_upload_result(helper4,utf8(b"mmm"),3,300);
        helper_upload_result(helper5,utf8(b"mmm"),3,300);



        upload_result(admin,utf8(b"mmm"),1,1,300);

        //claim_reward(user1,utf8(b"mmm"),300);
        destroy_pair_result(admin,utf8(b"mmm"),300);
        create_bet_card(user2,200000000,1200,3,utf8(b"ssd"),2600);
        // debug::print(&utf8(b"user 2 account"));
        // debug::print(borrow_global<Account_tree>(signer::address_of(user2)));

        // let pair_index = check_pair_index(caller,utf8(b"mmm"));
        // debug::print(&utf8(b"pair Chips"));
        // debug::print( vector::borrow(& borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,pair_index));

        // debug::print(&utf8(b"Seed resources"));
        // debug::print(&create_resource_address(&@dapp,Seed));
        //
        // debug::print(&utf8(b"Garble resources"));
        // debug::print(&create_resource_address(&@dapp,Garble_Seed));
        //
        // debug::print(&utf8(b"Helper resources"));
        // debug::print(&create_resource_address(&@dapp,Helper_Seed));

        //quite_helper(helper1);
        // debug::print(&utf8(b"User 1 badges"));
        // debug::print(&borrow_global<Account_tree>(signer::address_of(user1)).save_4);

        //let index =check_helper_index(helper1);
        // debug::print(&utf8(b"User 1 point"));
        // debug::print(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list, index).helper_point);
        //
        // debug::print(&utf8(b"User 1 wrong"));
        // debug::print(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list, index).wrong_times);

        // debug::print(&utf8(b"helper 1 badges"));
        // debug::print(&borrow_global<Account_tree>(signer::address_of(helper1)).save_4);
        // debug::print(&utf8(b"helper 2 badges"));
        // debug::print(&borrow_global<Account_tree>(signer::address_of(helper2)).save_4);
        // debug::print(&utf8(b"helper 3 badges"));
        // debug::print(&borrow_global<Account_tree>(signer::address_of(helper3)).save_4);

        // debug::print(&utf8(b"User 1 balance:"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user1)));
        // debug::print(&utf8(b" resource balance:"));
        // debug::print(&balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
        // debug::print(&utf8(b"Helper resource balance:"));
        // debug::print(&balance<AptosCoin>(create_resource_address(&@dapp,Bank_Seed)));
        // debug::print(&utf8(b"Helper 1 balance:"));
        // debug::print(&balance<AptosCoin>(signer::address_of(helper1)));
        // debug::print(&utf8(b"Helper 2 balance:"));
        // debug::print(&balance<AptosCoin>(signer::address_of(helper2)));
        // debug::print(&utf8(b"Helper 3 balance:"));
        // debug::print(&balance<AptosCoin>(signer::address_of(helper3)));
        // debug::print(&utf8(b"Helper 4 balance:"));
        // debug::print(&balance<AptosCoin>(signer::address_of(helper4)));
        // debug::print(&utf8(b"Helper 5 balance:"));
        // debug::print(&balance<AptosCoin>(signer::address_of(helper5)));


        // debug::print(&utf8(b"helper number"));
        // debug::print(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.heler_number);
        // debug::print(&utf8(b"wrong chance"));
        // debug::print(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.chance_for_wrong_time);
        // debug::print(&utf8(b"least help for major"));
        // debug::print(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_helper_chance.least_helper_result);
    }

    #[test(aptos_framework=@aptos_framework,caller=@dapp,admin=@admin1,user1=@0x11223,user2=@0x02333333,helper1=@0x555,helper2=@0x666,helper3=@0x777,helper4=@0x888,helper5=@0x9999,helper6=@0x101010)]
    fun test_helper_wrong(aptos_framework:&signer,caller:&signer,admin:&signer,user1:&signer,user2:&signer,helper1:&signer,helper2:&signer,helper3:&signer,helper4:&signer,helper5:&signer,helper6:&signer) acquires Diffusion_store_tree, ResourceCap, Account_tree {
        let apt_mint_cap= prepare_test(aptos_framework,caller);
        init_module(caller);
        prepare_user_account_for_test(admin,&apt_mint_cap);
        prepare_user_account_for_test(user1,&apt_mint_cap);
        prepare_user_account_for_test(user2,&apt_mint_cap);
        prepare_user_account_for_test(helper1,&apt_mint_cap);
        prepare_user_account_for_test(helper2,&apt_mint_cap);
        prepare_user_account_for_test(helper3,&apt_mint_cap);
        prepare_user_account_for_test(helper4,&apt_mint_cap);
        prepare_user_account_for_test(helper5,&apt_mint_cap);
        prepare_user_account_for_test(helper6,&apt_mint_cap);
        coin::deposit(create_resource_address(&@dapp,Seed),coin::mint(2000000000,&apt_mint_cap));
        coin::deposit(create_resource_address(&@dapp,Helper_Seed),coin::mint(2000000000,&apt_mint_cap));
        coin::destroy_mint_cap(apt_mint_cap);


        create_pair(admin,utf8(b"mmm"),110,100,200,100,130,100,300,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"trump vs bai"),102,100,800,100,3600,100,300,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"me vs you"),300,100,200,100,500,100,4600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"hello vs bye"),400,100,300,100,200,100,3600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"love me vs you"),200,100,110,100,600,100,8600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"iphone vs android"),200,100,300,100,200,100,2600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"aptos vs sol"),300,100,110,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"sss vs ddd"),200,100,300,100,200,100,2600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"bbb vs sss"),300,100,110,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"ssd"),200,100,300,100,200,100,2600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"sdv"),300,100,110,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"abc"),200,100,300,100,200,100,2600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"dsc"),400,100,140,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"asd"),350,100,150,100,390,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));
        create_pair(admin,utf8(b"csd"),320,100,170,100,300,100,9600,utf8(b"unexpected"),utf8(b"hhh"),utf8(b"bbb"));

        create_account_tree(user1,utf8(b"user1"),utf8(b"aaaa"));
        create_account_tree(user2,utf8(b"user2"),utf8(b"bbbb"));
        create_account_tree(helper1,utf8(b"helper1"),utf8(b"helper1"));
        create_account_tree(helper2,utf8(b"helper2"),utf8(b"helper2"));
        create_account_tree(helper3,utf8(b"helper3"),utf8(b"helper3"));
        create_account_tree(helper4,utf8(b"helper4"),utf8(b"helper4"));
        create_account_tree(helper5,utf8(b"helper5"),utf8(b"helper5"));
        create_account_tree(helper6,utf8(b"helper6"),utf8(b"helper6"));


        create_bet_card(user2,100000000,1200,2,utf8(b"mmm"),300);
        create_bet_card(helper1,100000000,1200,1,utf8(b"mmm"),300);

        create_bet_card(user1,100000000,1200,1,utf8(b"mmm"),300);
        create_bet_card(user1,300000000,1200,2,utf8(b"me vs you"),4600);
        create_bet_card(user1,200000000,1200,1,utf8(b"hello vs bye"),3600);

        // upload_result(admin,utf8(b"me vs you"),2,2);
        // upload_result(admin,utf8(b"hello vs bye"),3,3);





         //claim_reward(user1,utf8(b"me vs you"));
         create_bet_card(user2,300000000,1200,2,utf8(b"love me vs you"),8600);

        //create_bet_card(user2,200000000,1200,1,utf8(b"hello vs bye"));
        create_helper(admin,utf8(b"add"),signer::address_of(helper1));
        create_helper(admin,utf8(b"add"),signer::address_of(helper2));
        create_helper(admin,utf8(b"add"),signer::address_of(helper3));
        create_helper(admin,utf8(b"add"),signer::address_of(helper4));
        create_helper(admin,utf8(b"add"),signer::address_of(helper5));
        create_helper(admin,utf8(b"add"),signer::address_of(helper6));

        apply_to_be_helper(helper1);
        apply_to_be_helper(helper2);
        apply_to_be_helper(helper3);
        apply_to_be_helper(helper4);
        apply_to_be_helper(helper5);
        apply_to_be_helper(helper6);

        admin_said_times_up(admin,utf8(b"me vs you"),4600);

        //debug::print(&utf8(b"1 helper_upload_result  user1 ::"));
         helper_upload_result(helper1,utf8(b"me vs you"),2,4600);
       // debug::print(&utf8(b"1 helper_upload_result  user2 ::"));
         helper_upload_result(helper2,utf8(b"me vs you"),2,4600);
        //debug::print(&utf8(b"1 helper_upload_result  user3 ::"));
         helper_upload_result(helper3,utf8(b"me vs you"),2,4600);
         //debug::print(&utf8(b"1 helper_upload_result  user4 ::"));
         helper_upload_result(helper4,utf8(b"me vs you"),2,4600);
       // debug::print(&utf8(b"1 helper_upload_result  user5 ::"));
         helper_upload_result(helper5,utf8(b"me vs you"),3,4600);
        //debug::print(&utf8(b"1 helper_upload_result  user6 ::"));
         helper_upload_result(helper6,utf8(b"me vs you"),3,4600);
        upload_result(admin,utf8(b"me vs you"),3,3,4600);
        //helper_upload_result(helper6,utf8(b"abc"),3);
       //make_wrong_envirnment_of_helper(helper1,helper2,helper3,helper4,helper5,helper6);
        upgarde_user_level(helper6);
        upload_result(admin,utf8(b"mmm"),3,3,300);
        //debug::print(&utf8(b"4 upload  helper 4 result"));

        // debug::print(&utf8(b"specfic_helper wrong time helper1 "));
        // debug::print( &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,0).wrong_times);
        // debug::print(&utf8(b"specfic_helper wrong time helper2 "));
        // debug::print( &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,1).wrong_times);
        // debug::print(&utf8(b"specfic_helper wrong time helper3 "));
        // debug::print( &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,2).wrong_times);
        // debug::print(&utf8(b"specfic_helper wrong time helper4 "));
        // debug::print( &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,3).wrong_times);
        // debug::print(&utf8(b"specfic_helper wrong time helper5 "));
        // debug::print( &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,4).wrong_times);
        // debug::print(&utf8(b"specfic_helper wrong time helper6 "));
        // debug::print( &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,5).wrong_times);

        // debug::print(&utf8(b"2 helper_upload_result  user4 ::"));
        // helper_upload_result(helper4,utf8(b"aptos vs sol"),1);
        // debug::print(&utf8(b"2 helper_upload_result  user3 ::"));
        // helper_upload_result(helper3,utf8(b"aptos vs sol"),2);
        // debug::print(&utf8(b"2 helper_upload_result  user2 ::"));
        // helper_upload_result(helper2,utf8(b"aptos vs sol"),2);
        // debug::print(&utf8(b"2 helper_upload_result  user1 ::"));
        // helper_upload_result(helper1,utf8(b"aptos vs sol"),3);
        //
        // helper_upload_result(helper1,utf8(b"iphone vs android"),1);
        // helper_upload_result(helper2,utf8(b"iphone vs android"),1);
        // helper_upload_result(helper3,utf8(b"iphone vs android"),1);
        // helper_upload_result(helper4,utf8(b"iphone vs android"),1);

        // debug::print(&utf8(b"vector of helper "));
        // debug::print(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,2).account);
        // debug::print(&asc(caller,*vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,2)));
        // debug::print(&vector::is_empty(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,2).helper_contribute));
        // debug::print(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list,2).helper_contribute);
        //  debug::print(&utf8(b"length of helper list "));
        // debug::print(&vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list.list));

        // debug::print(&utf8(b" 1  save_Helper_list ::"));
        // debug::print(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Helper_list);

        // debug::print(&utf8(b" 1  helper resource account ::"));
        // debug::print(borrow_global<ResourceCap>(create_resource_address(&@dapp,Helper_Seed)));





        // debug::print(&utf8(b" 1 balance of resource ::"));
        // debug::print(&balance<AptosCoin>(create_resource_address(&@dapp,Seed)));
        // debug::print(&utf8(b" 1 balance of helper resource ::"));
        // debug::print(&balance<AptosCoin>(create_resource_address(&@dapp,Helper_Seed)));
        // debug::print(&utf8(b" 1 balancce of user1::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user1)));
        // debug::print(&utf8(b" 1 balancce of user2::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(user2)));
        // debug::print(&utf8(b" 1 balancce of helper1::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(helper1)));
        // debug::print(&utf8(b" 1 balancce of helper2::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(helper2)));
        // debug::print(&utf8(b" 1 balance of admin ::"));
        // debug::print(&balance<AptosCoin>(signer::address_of(admin)));


        // debug::print(&utf8(b" last borrow_resouce_pair ::"));
        // debug::print(borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)));
        // debug::print(&utf8(b"borrow_account_tree_from_user1 ::"));
        // debug::print(borrow_global<Account_tree>(signer::address_of(user1)));
        // debug::print(&utf8(b"borrow_account_tree_from_user2 ::"));
        // debug::print(borrow_global<Account_tree>(signer::address_of(user2)));
        // debug::print(&utf8(b"borrow_account_tree_from_helper1 ::"));
        // debug::print(borrow_global<Account_tree>(signer::address_of(helper1)));

    }
    #[test_only]
    fun prepare_user_account_for_test(caller:&signer,mint_cap:&MintCapability<AptosCoin>){
        create_account_for_test(signer::address_of(caller));
        register<AptosCoin>(caller);
        coin::deposit(signer::address_of(caller),coin::mint(2000000000,mint_cap));
    }
    #[test_only]
    fun prepare_test(aptos_framework:&signer,caller:&signer):MintCapability<AptosCoin>{
        timestamp::set_time_has_started_for_testing(aptos_framework);
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
            aptos_framework,
            string::utf8(b"TC"),
            string::utf8(b"TC"),
            8,
            false,
        );
        account::create_account_for_test(signer::address_of(caller));
        coin::register<AptosCoin>(caller);
        let coins = coin::mint<AptosCoin>(200000000, &mint_cap);
        coin::deposit(signer::address_of(caller), coins);
        coin::destroy_freeze_cap(freeze_cap);
        coin::destroy_burn_cap(burn_cap);
        system_addresses::assert_aptos_framework(aptos_framework);
        randomness::initialize_for_testing(aptos_framework);
        mint_cap
    }
    #[test_only]
    fun make_wrong_envirnment_of_helper(helper1:&signer,helper2:&signer,helper3:&signer,helper4:&signer,helper5:&signer,helper6:&signer) acquires Diffusion_store_tree, Account_tree {
        helper_upload_result(helper1,utf8(b"asd"),1,9600);
        // helper_upload_result(helper2,utf8(b"asd"),1);
        // helper_upload_result(helper3,utf8(b"asd"),1);
        // helper_upload_result(helper4,utf8(b"asd"),1);
        // helper_upload_result(helper5,utf8(b"asd"),2);
        // helper_upload_result(helper6,utf8(b"asd"),1);
        //
        // helper_upload_result(helper1,utf8(b"abc"),1);
        // helper_upload_result(helper2,utf8(b"abc"),1);
        // helper_upload_result(helper3,utf8(b"abc"),1);
        // helper_upload_result(helper4,utf8(b"abc"),1);
        // helper_upload_result(helper5,utf8(b"abc"),2);
        // helper_upload_result(helper6,utf8(b"abc"),1);
        //
        // helper_upload_result(helper1,utf8(b"iphone vs android"),1);
        // helper_upload_result(helper2,utf8(b"iphone vs android"),1);
        // helper_upload_result(helper3,utf8(b"iphone vs android"),1);
        // helper_upload_result(helper4,utf8(b"iphone vs android"),1);
        // helper_upload_result(helper5,utf8(b"iphone vs android"),2);
        // helper_upload_result(helper6,utf8(b"iphone vs android"),1);

    }
    ////////////////// Init fun /////////////////////////////////
    ///
    ///
    ////////////////// game.move /////////////////////////////////
    fun pay_to_user(caller:&signer,amount:u64) acquires ResourceCap {
        let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
        let resource_signer  = create_signer_with_capability(&borrow.cap);
        assert!(amount !=0,NO_zero_pay_to_user);
        assert!(signer::address_of(caller)!=signer::address_of(&resource_signer),NO_same_address_with_user);
        transfer<AptosCoin>(&resource_signer,signer::address_of(caller),amount);
    }


    //pay fun //

    // logic fun //////



    fun destroy_bet_card(caller:&signer,pair_name1:string::String,expired_date:u64) acquires  Account_tree {
        //let borrow = borrow_global_mut<Bet_card>(signer::address_of(caller));
        let user_acccount = borrow_global_mut<Account_tree>(signer::address_of(caller));
        let index = check_which_index_for_bet_card(caller,pair_name1,user_acccount,expired_date);
        vector::remove(&mut user_acccount.save_2,index);
        // let user_bet_card = vector::borrow_mut(&mut user_acccount.save_2,index);
        // let a =  move_from<Bet_card>(signer::address_of(caller));
        // let  new_betcard = Bet_card{account:a.account,
        //                             which: 99,
        //                             pair:Pair{
        //                                 pair_name:utf8(b""),
        //                                 left:0,
        //                                 middle:0,
        //                                 right:0,
        //                                 expired_time:0
        //                             },
        //                             bet:0,
        //                             a_win:0,
        //                             b_win:0,
        //                             c_win:0,
        //                             time:0
        //                     };
        // move_to(caller,new_betcard)
    }

    fun check_is_same_address(caller : &signer , bet_card_address:address,user_address:address) {
        assert!((bet_card_address==user_address),Not_same_address);
    }

    fun check_pair_right(caller:&signer,pair:Pair,index:u64) acquires ResourceCap, Diffusion_store_tree {
        let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
        let resource_signer  = create_signer_with_capability(&borrow.cap);

        let borrow_resource_pair_result_store = &borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store;
        let borrow_specific_pair = vector::borrow(&borrow_resource_pair_result_store.save_pair,index);
        assert!((borrow_specific_pair.pair_name==pair.pair_name),Not_same_pair);

    }

    fun check_which_index_for_bet_card(caller:&signer,pair_name:String,borrow:&Account_tree,expired_time:u64) :u64 {
        //let borrow = borrow_global_mut<Pair_result_store>(signer::address_of(caller));
        let length = vector::length(&borrow.save_2);
        let  i = 0 ;
        while ( i <length){
            let pair_ref = vector::borrow(&borrow.save_2,i);
            if(pair_ref.expired_time == expired_time){
                if(pair_ref.pair.pair_name == pair_name){
                    return i
                };
            };
            i=i+1
        };
        return 99
    }

    fun check_which_index(caller:&signer,pair_name:String,borrow:&Pair_result_store,expired_time:u64) :u64 {
        //let borrow = borrow_global_mut<Pair_result_store>(signer::address_of(caller));
        let length = vector::length(&borrow.save_pair);
        let  i = 0 ;
        if(length != 0) {
            while (i < length) {
                let pair_ref = vector::borrow(&borrow.save_pair, i);
                if (pair_ref.pair_name == pair_name) {
                    if (pair_ref.expired_time == expired_time) {
                        return i
                    }
                };
                i = i + 1
            };
        };
        return 99
    }

    fun check_is_the_right_card(caller:&signer,pair_reult:&Pair_result_store,user_card:&Bet_card) acquires ResourceCap, Diffusion_store_tree {
        let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
        let resource_signer  = create_signer_with_capability(&borrow.cap);
        let index = check_which_index(&resource_signer,user_card.pair.pair_name,pair_reult,user_card.pair.expired_time);
        check_pair_right(&resource_signer,user_card.pair,index);
        assert!((signer::address_of(caller) != user_card.account),Not_same_address);
        // check_is_same_address(&resource_signer,user_card.account,signer::address_of(caller));
    }
    //logic fun ////

    // init fun ////


    //init fun ///


    // admin fun///
    public entry fun admin_like(caller:&signer,amount:u64,where1:string::String,where2:string::String) acquires ResourceCap {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);
        if(where1 == utf8(b"resources") && where2 == utf8(b"admin")){
            let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
            let resource_signer  = create_signer_with_capability(&borrow.cap);
            assert!(balance<AptosCoin>(signer::address_of(&resource_signer))>=amount,NOT_enough_amount);
            let coins =  coin::withdraw<AptosCoin>(&resource_signer,amount);
            coin::deposit(signer::address_of(caller),coins);
        }else if(where1 == utf8(b"bank") && where2 == utf8(b"resources") ){
            let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Bank_Seed));
            let resource_signer  = create_signer_with_capability(&borrow.cap);
            assert!(balance<AptosCoin>(signer::address_of(&resource_signer))>=amount,NOT_enough_amount);
            let coins =  coin::withdraw<AptosCoin>(&resource_signer,amount);
            coin::deposit(create_resource_address(&@dapp,Seed),coins);
        }else if(where1 == utf8(b"garble") && where2 == utf8(b"resources") ){
            let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Garble_Seed));
            let resource_signer  = create_signer_with_capability(&borrow.cap);
            assert!(balance<AptosCoin>(signer::address_of(&resource_signer))>=amount,NOT_enough_amount);
            let coins =  coin::withdraw<AptosCoin>(&resource_signer,amount);
            coin::deposit(create_resource_address(&@dapp,Seed),coins);
        }else if(where1 == utf8(b"helper") && where2 == utf8(b"resources") ){
            let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Helper_Seed));
            let resource_signer  = create_signer_with_capability(&borrow.cap);
            assert!(balance<AptosCoin>(signer::address_of(&resource_signer))>=amount,NOT_enough_amount);
            let coins =  coin::withdraw<AptosCoin>(&resource_signer,amount);
            coin::deposit(create_resource_address(&@dapp,Seed),coins);
        }


    }

    public entry fun destroy_pair_result(caller:&signer,pair_name1:string::String,expired_time:u64) acquires ResourceCap,  Diffusion_store_tree {

        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);

        let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
        let resource_signer  = create_signer_with_capability(&borrow.cap);
        let borrow_resource_pair_store = &borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store;
        let index = check_which_index(caller,pair_name1,borrow_resource_pair_store,expired_time);
        assert!(index!=99,NOT_exist_pair);

        let admin_set = vector::borrow(&borrow_resource_pair_store.save_admin_set_result,index);
        assert!(admin_set == &true,Admin_not_set_result);
        asc3(caller);
        share_to_allocation(caller,vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index).pair_name,vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index).expired_time);

        let ended_pair = Ended_pair{
            save_pair:*vector::borrow(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index),
            result:*vector::borrow(& borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index),
        };
        smart_vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_lost_pair,ended_pair);


        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index);
        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,index);
        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index);
        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index);
        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index);


    }

    public entry fun create_pair(caller:&signer,pair_name:string::String,left_ratio:u64,left_ratio1:u64,middle_ratio:u64,middle_ratio1:u64,right_ratio:u64,right_ratio1:u64,time:u64,pair_type1:string::String,left_url1:string::String,right_url1:string::String) acquires   Diffusion_store_tree {
        let admin_index = check_admin_index(signer::address_of(caller));
        assert!(pair_type1==utf8(b"sport")||pair_type1==utf8(b"game")||pair_type1==utf8(b"unexpected"),PAIR_TYPE_NOT_TRUE);
        assert!( admin_index!=99 ||signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin); //admin check
        let new_pair = Pair{
            pair_type:pair_type1,
            pair_name,
            left_url:left_url1,
            right_url:right_url1,
            left:left_ratio,
            left2:left_ratio1,
            middle:middle_ratio,
            middle2:middle_ratio1,
            right:right_ratio,
            right2:right_ratio1,
            can_bet:true,
            expired_time:time};
        //let borrow_resource_pair_store = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));
        let index = check_pair_index_without_borrow_version(caller,new_pair.pair_name);
        assert!(index==99,ALREADY_EXIST_THIS_PAIR);

        push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,false);
        push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,false);
        push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,9);
        push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,new_pair);
        push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,Chips{left:0,middle:0,right:0,given:0});
        push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,Save_user_bet{pair:new_pair,save_bet_data:vector::empty<Bet_data>()});
    }

    public entry  fun upload_result(caller:&signer,pair_name1:string::String,result1:u8,result2 :u8,expired_time:u64) acquires Diffusion_store_tree {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);
        assert!(result1==1||result1==2||result1==3 || result1 ==50,RESULT_NOT_123);
        assert!(result1==result2,RESULT_NOT_SAME);
        assert!(exists<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)) == true,Not_exists_diffusion_store_tree);
        //let borrow_resource_pair_result_store = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));

        let index = check_which_index(caller,pair_name1,&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store,expired_time);
        // debug::print(&utf8(b"pair_name"));
        // debug::print(&pair_name1);
        // debug::print(&expired_time);
        // debug::print(&utf8(b"index"));
        // debug::print(&index);
        assert!(index != 99 ,NOT_exist_pair);
        assert!(vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair) == vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips),Pair_length_not_same_as_Chips);
        assert!(*vector::borrow(& borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim ,index )!= true && *vector::borrow(& borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index) != true ,Admin_already_upload_result);
        let old_borrow_specific_pair = *vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index);
        let old_borrow_specific_chips = *vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index);
        // let old_result = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index);
        // let old_Admin_set = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index);
        // let old_can_claim =vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,index);

        // vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index) = &mut  result1;
        // vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index) =  &mut true;
        // vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,index) = &mut true;

        assert!( vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result) >= index ,Save_result_too_short);
        assert!( vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result) >= index ,Save_admin_set_result);
        assert!( vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair) >= index ,Save_pair_too_short);
        assert!( vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,) >= index ,Save_can_claim_too_short);
        assert!( vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips) >= index ,Save_chips_too_short);

        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index);
        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index);
        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index);
        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,index);
        vector::remove(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index);


        vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,result1);
        vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,true);
        vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,true);
        vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,old_borrow_specific_pair);
        vector::push_back(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,old_borrow_specific_chips);

        // debug::print(&utf8(b"result of upload"));
        // let length =vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair)-1;
        // debug::print(vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,length));
        // debug::print(&vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,length).expired_time);
        // debug::print(vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,length));
        // debug::print(vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,length));
        // debug::print(vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,length));
    }
    //
    //
    fun check_ended_pair(pair_name:string::String):u64 acquires Diffusion_store_tree {
        let i=0;
        assert!(exists<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)),Not_exists_diffusion_store_tree);
        let length = smart_vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_lost_pair);
        if(length != 0) {
            while (i < length) {
                let borrow = smart_vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_lost_pair,i);
                if(borrow.save_pair.pair_name == pair_name){
                    return i
                };
                i = i + 1;
            }
        };
        return 99
    }
    fun drop_lost_card(caller:&signer) acquires  Account_tree, Diffusion_store_tree {

        //let borrow_pair_result_store = &borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store;
        assert!(exists<Account_tree>(signer::address_of(caller)),Create_account_first);
        // let borrow_user_account_tree = borrow_global_mut<Account_tree>(signer::address_of(caller));
        let length_pair = vector::length(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair);
        let lenght_bet_card = vector::length(&borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2);

        let j = 0 ;
        if(length_pair != 0 ){
            if(lenght_bet_card != 0){
                while ( j < lenght_bet_card){
                    let i =0 ;
                    //let borrow_user_bet_card = vector::borrow(& borrow_user_account_tree.save_2,j);
                    while ( i < length_pair ){
                        // let borrow_rsult_store_Pair_name = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,i);
                        // let borrow_admin_set = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,i);
                        // let borrow_can_claim = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,i);
                        // let borrow_reult = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,i);

                       if(is_empty<Bet_card>(& borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2)){}else {
                           //assert!(borrow_user_bet_card.pair.pair_name==borrow_rsult_store_Pair_name.pair_name,NOT_SAME_PAIR_DROP_LOST_CARD);
                           let index = check_ended_pair(vector::borrow(& borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,j).pair.pair_name);
                            if(index !=99){
                                if( smart_vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_lost_pair,index).save_pair.expired_time == vector::borrow(&borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,j).expired_time) {
                                    if (smart_vector::borrow(
                                        &borrow_global<Diffusion_store_tree>(
                                            create_resource_address(&@dapp, Seed)
                                        ).save_Pair_result_store.save_lost_pair,
                                        index
                                    ).result != vector::borrow(
                                        &borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,
                                        j
                                    ).which) {
                                        borrow_global_mut<Account_tree>(
                                            signer::address_of(caller)
                                        ).save_5.lose = borrow_global_mut<Account_tree>(
                                            signer::address_of(caller)
                                        ).save_5.lose + vector::borrow(
                                            &borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,
                                            j
                                        ).bet;
                                        vector::remove(
                                            &mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,
                                            j
                                        );
                                    }
                                };
                            }else {
                                if (vector::borrow(
                                    &borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,
                                    j
                                ).pair.pair_name == vector::borrow(
                                    &borrow_global_mut<Diffusion_store_tree>(
                                        create_resource_address(&@dapp, Seed)
                                    ).save_Pair_result_store.save_pair,
                                    i
                                ).pair_name) {
                                    if (vector::borrow(
                                        &borrow_global_mut<Diffusion_store_tree>(
                                            create_resource_address(&@dapp, Seed)
                                        ).save_Pair_result_store.save_admin_set_result,
                                        i
                                    ) == &true) {
                                        if (vector::borrow(
                                            &borrow_global_mut<Diffusion_store_tree>(
                                                create_resource_address(&@dapp, Seed)
                                            ).save_Pair_result_store.save_can_claim,
                                            i
                                        ) == &true) {
                                            if (vector::borrow(
                                                &borrow_global_mut<Diffusion_store_tree>(
                                                    create_resource_address(&@dapp, Seed)
                                                ).save_Pair_result_store.save_result,
                                                i
                                            ) != &vector::borrow(
                                                &borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,
                                                j
                                            ).which) {
                                                borrow_global_mut<Account_tree>(
                                                    signer::address_of(caller)
                                                ).save_5.lose = borrow_global_mut<Account_tree>(
                                                    signer::address_of(caller)
                                                ).save_5.lose + vector::borrow(
                                                    &borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,
                                                    j
                                                ).bet;
                                                vector::remove(
                                                    &mut borrow_global_mut<Account_tree>(
                                                        signer::address_of(caller)
                                                    ).save_2,
                                                    j
                                                );
                                            }
                                        }
                                    }
                                };
                            };
                       };
                        i=i+1;
                    };
                    j=j+1;
                }

            }
        }
    }
    public entry fun create_bet_card(caller:&signer,bet1:u64,time1:u64,which1:u8,pair_name1:string::String,expired_time:u64) acquires  ResourceCap, Account_tree, Diffusion_store_tree {
        upgarde_user_level(caller);
        drop_lost_card(caller);
        assert!(which1 == 1 || which1==2 || which1 ==3 ,NOT_RIGHT_INPUT);
        assert!(exists<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)),Not_exists_diffusion_store_tree);
        assert!(exists<Account_tree>(signer::address_of(caller)),Create_account_first);
        let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
        let resource_signer  = create_signer_with_capability(&borrow.cap);
       // let borrow_pair_result_store = &borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store;

        let index = check_which_index(caller, pair_name1,&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store,expired_time);
        assert!(index!=99,NOT_exist_pair);
        //let admin_set = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index);
        //let can_claim = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index);
        assert!(vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index) != &true && vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_admin_set_result,index) != &true,Pair_finish);

        let can_bet = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index).can_bet;
        assert!(can_bet==true,Time_to_helper_upload);

        let a = *vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_pair,index);
        let fee = bet1*borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.fees_1/borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.fees_2;
        let coin = coin::withdraw<AptosCoin>(caller,fee);

        coin::deposit(signer::address_of(&resource_signer),coin);
        let user_index = check_which_index_for_bet_card(caller,pair_name1,borrow_global<Account_tree>(signer::address_of(caller)),expired_time);
        if(user_index == 99){
            let left_win = bet1 * a.left / a.left2 ;
            let middle_win = bet1 * a.middle / a.middle2;
            let right_win = bet1 * a.right / a.right2;
            let card_1 = Bet_card{account:signer::address_of(caller),
                which:which1,
                pair:Pair{
                    pair_type:a.pair_type,
                    pair_name:a.pair_name,
                    left_url:a.left_url,
                    right_url:a.right_url,
                    left:a.left,
                    left2:a.left2,
                    middle:a.middle,
                    middle2:a.middle2,
                    right:a.right,
                    right2:a.right2,
                    can_bet:false,
                    expired_time:a.expired_time},
                bet:bet1,
                a_win:left_win,
                b_win:middle_win,
                c_win:right_win,
                time:time1,
                expired_time:a.expired_time};

            //move_to(caller,card_1);

            let user_account = borrow_global_mut<Account_tree>(signer::address_of(caller));
            vector::push_back(&mut user_account.save_2,card_1);
        }else{
            let user_account =vector::borrow_mut(&mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,user_index);
            assert!(which1 == user_account.which,Only_allow_plus);
            // debug::print(&utf8(b"user_new _which : "));
            // debug::print(&which1 );
            // debug::print(&utf8(b"old which"));
            // debug::print(&user_account.which);
            let new_bet_card = Bet_card{
                account:user_account.account,
                which:user_account.which,
                pair:user_account.pair,
                bet:user_account.bet+bet1,
                a_win:user_account.a_win+user_account.pair.left*bet1/user_account.pair.left2,
                b_win:user_account.b_win+user_account.pair.middle*bet1/user_account.pair.middle2,
                c_win:user_account.c_win+user_account.pair.right*bet1/user_account.pair.right2,
                time:time1,
                expired_time:user_account.expired_time,
            };
            vector::push_back(&mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,new_bet_card);
            vector::remove(&mut borrow_global_mut<Account_tree>(signer::address_of(caller)).save_2,user_index);
        };
        let p = (1 as u8);
        let u = (2 as u8);
        let i = (3 as u8);
        //let index = check_which_index(caller ,a.pair_name,&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store);

        let borrow_chip = borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed));
        let which_chips  =  vector::borrow_mut( &mut borrow_chip.save_Pair_result_store.save_chips,index);
        if(which1 == p){
            which_chips.left =  which_chips.left+ bet1;
        }else if(which1 == u) {
            which_chips.middle =  which_chips.middle+bet1;
        }else if(which1 == i ){
            which_chips.right = which_chips.right + bet1;
        };
        vector::push_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).save_bet_data,Bet_data{save_address:signer::address_of(caller),save_amount:bet1});
        add_point_to_user(caller);
    }
    // spec create_bet_card {
    //     pragma aborts_if_is_strict;
    // }
    ////////////////// user fun //
    public entry fun claim_reward(caller :&signer,pair_name1:string::String,expired_date:u64) acquires ResourceCap, Account_tree, Diffusion_store_tree {
        //let borrow_resouce = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
        // let resource_signer = create_signer_with_capability(&borrow_resouce.cap);
        // let borrow = &borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store;
        assert!(exists<Account_tree>(signer::address_of(caller)) == true,Create_account_first);
        let user_account = borrow_global_mut<Account_tree>(signer::address_of(caller));
        let user_index = check_which_index_for_bet_card(caller,pair_name1,user_account,expired_date);
        assert!(user_index!=99,You_dont_bet_this_pair);
        let borrow_user_bet_card = vector::borrow(&user_account.save_2,user_index);
        //let user_card =  borrow_global<Bet_card>(signer::address_of(caller));
        let index =  check_which_index(caller,pair_name1,&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store,expired_date);
        // let result_of_pair  =vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index);
        // let can_claim = vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,index);


        assert!( vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_can_claim,index)!=&false,NOT_the_right_time_to_claim);
        assert!(index!=99,NOT_exist_pair);

        check_is_same_address(caller,borrow_user_bet_card.account,signer::address_of(caller));

        // let borrow_chips = vector::borrow_mut(&mut borrow.save_chips,index);

        if(&borrow_user_bet_card.which==vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index)){
            assert!(vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index)==&borrow_user_bet_card.which,GUESS_WRONG);
            if(&borrow_user_bet_card.which==&1){
                pay_to_user(caller,borrow_user_bet_card.a_win);
                user_account.save_5.win=user_account.save_5.win+borrow_user_bet_card.a_win;

                vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given= vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given + borrow_user_bet_card.a_win;
                // debug::print(&utf8(b"a win"));
                // debug::print(&borrow_user_bet_card.a_win);
                // debug::print(&utf8(b"given"));
                // debug::print(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given);
            }else if(&borrow_user_bet_card.which==&2){
                pay_to_user(caller,borrow_user_bet_card.b_win);
                vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given=vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given + borrow_user_bet_card.b_win;
                user_account.save_5.win=user_account.save_5.win+borrow_user_bet_card.b_win;
                // debug::print(&utf8(b"b win"));
                // debug::print(&borrow_user_bet_card.b_win);
                // debug::print(&utf8(b"given"));
                // debug::print(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given);
            }else if (&borrow_user_bet_card.which==&3){
                pay_to_user(caller,borrow_user_bet_card.c_win);
                vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given= vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given + borrow_user_bet_card.c_win;
                user_account.save_5.win=user_account.save_5.win+borrow_user_bet_card.c_win;
                // debug::print(&utf8(b"c win"));
                // debug::print(&borrow_user_bet_card.c_win);
                // debug::print(&utf8(b"given"));
                // debug::print(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given);
            }else if (&borrow_user_bet_card.which==&50){
                if(vector::borrow( &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).pair.pair_name ==pair_name1){
                    let i = 0;

                    let length2 = vector::length(&vector::borrow( &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).save_bet_data);
                    while(i < length2 ){
                        let specfic = vector::borrow(&vector::borrow( &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).save_bet_data,i);
                        if(specfic.save_address == signer::address_of(caller)){
                            let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
                            let resource_signer  = create_signer_with_capability(&borrow.cap);
                            if(specfic.save_amount!=0){
                                if(specfic.save_address!=create_resource_address(&@dapp,Seed)){
                                    coin::transfer<AptosCoin>(&resource_signer,specfic.save_address,specfic.save_amount);
                                    vector::remove(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).save_bet_data,i);
                                }
                            }
                        };
                        i = i+1;
                    };
                }

                // debug::print(&utf8(b"c win"));
                // debug::print(&borrow_user_bet_card.c_win);
                // debug::print(&utf8(b"given"));
                // debug::print(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_chips,index).given);
            }else {};
            vector::remove(&mut user_account.save_2,user_index);
            //destory_bet_card(caller,pair_name1);
        }else if(vector::borrow(&borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_result,index)==&50){
            if(vector::borrow( &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).pair.pair_name ==pair_name1){
                let i = 0;

                let length2 = vector::length(&vector::borrow( &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).save_bet_data);
                while(i < length2 ){
                    let specfic = vector::borrow(&vector::borrow( &borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).save_bet_data,i);
                    if(specfic.save_address == signer::address_of(caller)){
                        let borrow = borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed));
                        let resource_signer  = create_signer_with_capability(&borrow.cap);
                        if(specfic.save_amount!=0){
                            if(specfic.save_address!=create_resource_address(&@dapp,Seed)){
                                coin::transfer<AptosCoin>(&resource_signer,specfic.save_address,specfic.save_amount);
                                vector::remove(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Pair_result_store.save_user,index).save_bet_data,i);
                                vector::remove(&mut user_account.save_2,user_index);
                            }
                        }
                    };
                    i = i+1;
                };

            }

        }

    }

    #[randomness]
     entry fun generate_random_num(caller:&signer) acquires Account_tree {

        let a = randomness::u64_integer();
        let b = randomness::u64_integer();

        borrow_global_mut<Account_tree>(signer::address_of(caller)).save_3.random_seed1=a;
        borrow_global_mut<Account_tree>(signer::address_of(caller)).save_3.random_seed2=b;
    }



    #[randomness]
    entry fun create_account_tree(caller:&signer,user_name:string::String,user_icon_url:string::String){
        assert!(!exists<Account_tree>(signer::address_of(caller)),ALREADY_CREATE_ACCOUNT);
         let a = randomness::u64_integer();
         let b = randomness::u64_integer();
        let new_account = Account_tree{
            save_1:Profile{
                name:user_name,
                account_address:signer::address_of(caller),
                icon:user_icon_url,
                account_Amount:0
            },
            save_2:vector::empty<Bet_card>(),
            save_3:Rndom_Seed{
                random_seed1:a,
                random_seed2:b
            },
            save_4:vector::empty<Badges>(),
            save_5:Level{
                level:0,
                win:0,
                lose:0,
                diffusion_loyalty:0
            }
        };
        let user_badges = Badges{Name:utf8(b"User"),url:utf8(b"https://pot-124.4everland.store/user_badges.png")};
        push_back(&mut new_account.save_4,user_badges);
        move_to(caller,new_account);
       // generate_random_num(caller);
    }
    //
    // ////////////////// game.move /////////////////////////////////
    // ///
    // ///
    // ////////////////// Cylinder move /////////////////////////////////

    spec reload_batch<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:vector<u64>,to_address:vector<address>,coin:string::String,coin_address:address,send_coin_amount:u64){
        pragma verify =false;
    }

    #[randomness]
     entry  fun reload_batch<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:vector<u64>,to_address:vector<address>,coin:string::String,coin_address:address,send_coin_amount:u64) acquires ResourceCap, Diffusion_store_tree, Account_tree {
        upgarde_user_level(caller);
        let resources_signer = create_signer_with_capability(&borrow_global<ResourceCap>(create_resource_address(&@dapp,Garble_Seed)).cap);
        assert!(coin::balance<AptosCoin>(signer::address_of(caller)) >= check_total_of_input_vector_amount(amount), NOT_enought_balance);
        assert!(!vector::is_empty(&amount),Empty_input);
        let total_amount = check_total_of_input_vector_amount(amount);
        assert!(total_amount != 0,NO_zero_input);
        assert!(vector::length(&amount) == vector::length(&to_address),Iuput_of_length_not_same);
        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        pay_to_garble_resource_address<CoinA>(caller,check_total_of_input_vector_amount(amount),coin,coin_address,send_coin_amount);

        assert!(signer::address_of(caller)!=create_resource_address(&@dapp,Garble_Seed),Canot_same_address_with_garble_resources_address);





        if((need_garble == true) && (need_swap == false)) {
            if(index != 99){
                push_vector_to_main_tree(amount,to_address,coin,coin_address,send_coin_amount);
                vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).save_total =vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).save_total + total_amount;
                send_batch_transfer<CoinA>(&resources_signer, coin, coin_address, send_coin_amount);
            }
        }else if((need_garble == false) && (need_swap == false)){
            if (type_info::type_name<CoinA>() == utf8(b"0x1::aptos_coin::AptosCoin")) {
                let check = check_vectors(caller ,&to_address,&amount);
                if (check == true) {
                    batch_transfer(caller, to_address, amount);
                };
                //clean_vector(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs, find_coin_index_in_main_tree(coin,coin_address,send_coin_amount)));
            }else {
                let check = check_vectors(caller ,&to_address,&amount);
                if (check == true) {
                    batch_transfer_coins<CoinA>(caller, to_address, amount);
                };
                //clean_vector(coin,coin_address,send_coin_amount);
            };
        }else if ((need_garble ==true) && (need_swap == true)){

        }else if((need_garble ==false) && (need_swap == true)){};


        let random1 = randomness::u64_integer();
        let random2 = randomness::u64_integer();
        nft_random(caller,random1,random2);
        add_point_to_user(caller);
    }
    spec reload_single<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:u64,to_address:address,coin:string::String,coin_address:address,send_coin_amount:u64){
        pragma verify = false;

    }

    // #[randomness]
    //  fun generate_u64(caller:&signer) : (u64 , u64) {
    //         let a = randomness::u64_integer();
    //         let b = randomness::u64_integer();
    //         return (a,b)
    // }
    #[randomness]
     entry fun reload_single<CoinA,CoinB>(caller:&signer,need_swap:bool,need_garble:bool,amount:u64,to_address:address,coin:string::String,coin_address:address,send_coin_amount:u64) acquires ResourceCap, Diffusion_store_tree, Account_tree {
        assert!(exists<Account_tree>(signer::address_of(caller)),Create_account_first);
        assert!(signer::address_of(caller) != to_address,Cant_Same_address_with_caller);
        upgarde_user_level(caller);
        let resources_signer = create_signer_with_capability(&borrow_global<ResourceCap>(create_resource_address(&@dapp,Garble_Seed)).cap);
        assert!(coin::balance<AptosCoin>(signer::address_of(caller)) >= amount,NOT_enought_balance);
        assert!(amount != 0,NO_zero_input);
        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        assert!(index !=99 ,NOT_exist_cylinder);
        register<CoinA>(&resources_signer);
        pay_to_garble_resource_address<CoinA>(caller,amount,coin,coin_address,send_coin_amount);
        if((need_garble == true) && (need_swap == false)) {
            assert!(type_info::account_address(&type_info::type_of<CoinA>()) == coin_address,Coin_type_not_same_as_input_address);
            assert!(amount == send_coin_amount,Amount_input_not_same);

            if(index !=99){
                vector::push_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector,to_address);
                vector::push_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector,amount);
                vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_total =vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_total + amount;
                send_batch_transfer<CoinA>(&resources_signer, coin, coin_address, send_coin_amount);
            };
         }else if((need_garble == false) && (need_swap == false)){
            if (type_info::type_name<CoinA>() == utf8(b"0x1::aptos_coin::AptosCoin")) {
                if(signer::address_of(&resources_signer)!=to_address){
                    if(amount != 0 ){
                        aptos_account::transfer(&resources_signer,to_address,amount);
                    }
                }
            }else {
                if(signer::address_of(&resources_signer)!=to_address){
                    if(amount != 0 ){
                        transfer_coins<CoinA>(&resources_signer,to_address,amount);
                       //transfer<CoinA>(&resources_signer,to_address,amount);
                    }
                }
            };
        }else if ((need_garble ==true) && (need_swap == true)){

        }else if((need_garble ==false) && (need_swap == true)){};
        // let (random1,random2) =generate_u64(caller);
        let random1 = randomness::u64_integer();
        let random2 = randomness::u64_integer();
        nft_random(caller,random1,random2);
        add_point_to_user(caller);
    }
    //
    // //////// User Function ////////////
    //
    // /////// Admin Function ////////////
    //
    // /////// Admin Function ////////////
    //
    // //////// Pay function ////////
    //
    fun add_point_to_user(caller:&signer) acquires Account_tree {
        borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty=borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty+1;
    }

    public fun admin_mint_nft(caller:&signer) acquires ResourceCap, Diffusion_store_tree {
        assert!(signer::address_of(caller)==@admin1 || signer::address_of(caller)==@admin2 ,Not_admin);
        mint_diffustion(caller);
    }
    spec admin_mint_nft(caller:&signer){
        pragma verify = false;
    }
    spec mint_diffustion(caller:&signer){
        pragma verify = false;
    }
    fun mint_diffustion(caller:&signer) acquires ResourceCap, Diffusion_store_tree {

        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;

        let borrow1 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_id;

        let resource_signer = create_signer_with_capability(borrow);


        let c =utf8(b"___#");
        let d =  string::utf8(Collection_name_token_describe);

        // string::append(&mut d,c);
        // string::append( &mut d,string_utils::to_string(&borrow1));

        let royalty=create(15,100,@admin1);
        let token_cref = token::create_numbered_token(
            &resource_signer,
            utf8(Name_nft),
            utf8(Description_nft),
            string::utf8(TokenPrefix),
            string::utf8(b""),
            option::some(royalty),
            utf8(Url_nft),

        );


        let token_signer = object::generate_signer(&token_cref);
        let token_mutator_ref = token::generate_mutator_ref(&token_cref);
        let token_burn_ref = token::generate_burn_ref(&token_cref);

        move_to(
            &token_signer,
            TokenRefsStore {
                mutator_ref: token_mutator_ref,
                burn_ref: token_burn_ref,
                extend_ref: object::generate_extend_ref(&token_cref),
                transfer_ref: option::none()
            }
        );
        object::transfer(
            &resource_signer,
            object::object_from_constructor_ref<Token>(&token_cref),
            signer::address_of(caller),
        );

    }
    spec nft_random(caller: &signer, random1: u64, random2: u64) {
        pragma verify = false;
    }
    fun nft_random(caller:&signer,random1:u64,random2:u64) acquires Account_tree, Diffusion_store_tree, ResourceCap {
        let a = borrow_global<Account_tree>(signer::address_of(caller)).save_3.random_seed1;
        let b =  borrow_global<Account_tree>(signer::address_of(caller)).save_3.random_seed2;

        let result1 = (random1)/(borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_2 )*(borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_1 );
        let result2 = (random2)/(borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_2 )*(borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.nft_chance_1 );
        if(result1 == result2){
            mint_diffustion(caller);
        }
    }


    fun pay_to_garble_resource_address<CoinA>(caller:&signer,amount:u64,coin1:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree {
        assert!(exists<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)),Not_exists_diffusion_store_tree);
        assert!(exists<ResourceCap>(create_resource_address(&@dapp,Garble_Seed)),Not_exists_Garble_resource_cap);

        let fee1 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.fees_1;
        let fee2 = borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).fee.fees_2;
        let cost = (amount*fee1)/fee2;
        assert!((amount+cost)!=0,NO_zero_input);
        let coin = coin::withdraw<CoinA>(caller,cost);
        let index = find_coin_index_in_main_tree(coin1,coin_address,send_coin_amount);
        assert!(index !=99 ,NOT_exist_cylinder);
        coin::deposit<CoinA>(create_resource_address(&@dapp,Garble_Seed),coin);
        vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_total =vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_total + amount;
    }

    // fun check_vector_is_zero_caller_version(caller:&signer,vector_address:&vector<address>,vector_amount:&vector<u64>):(bool,bool){
    //     let state1 =false;
    //     let state2 = false;
    //     let vector_address_cout = 0;
    //     let vector_amount_cout = 0;
    //     let i =0;
    //         if(vector::length(vector_address) == vector::length(vector_amount)) {
    //             let lenght = vector::length(vector_address);
    //             if(lenght != 0) {
    //                 while (i < lenght) {
    //                     let borrow_amount = vector::borrow(vector_amount, i);
    //                     let borrow_address = vector::borrow(vector_address, i);
    //                     assert!(*borrow_amount != 0 ,Boorow_ZERO);
    //                     assert!( borrow_address != &create_resource_address(&@dapp,Garble_Seed) ,Boorow_ZERO);
    //                     if (*borrow_amount != 0) {
    //                         vector_amount_cout = vector_amount_cout + 1;
    //                     };
    //                     if (borrow_address != &create_resource_address(&@dapp,Garble_Seed)) {
    //                         vector_address_cout = vector_address_cout + 1;
    //                     };
    //                     i = i + 1;
    //                 };
    //                 if ((vector_address_cout == vector::length(vector_address))) {
    //                     if (vector_address_cout != 0) {
    //                         state1 = true;
    //                     };
    //                 };
    //                 if ((vector_amount_cout == vector::length(vector_amount))) {
    //                     if (vector_amount_cout != 0) {
    //                         state2 = true;
    //                     }
    //                 };
    //             };
    //
    //         };
    //     return (state1 ,state2)
    // }
    spec check_vectors(caller: &signer, vector_address: &vector<address>, vector_amount: &vector<u64>): bool {
        pragma verify = false;
    }
    fun check_vectors(caller: &signer, vector_address: &vector<address>, vector_amount: &vector<u64>): bool {
        let caller_address = signer::address_of(caller);

        if (vector::length(vector_address) != vector::length(vector_amount)) {
            return false
        };
        // assert!(vector::length(vector_address) != vector::length(vector_amount),NO_zero_input);
        let length = vector::length(vector_address);
        let  i = 0;

        while (i < length) {
            let address = vector::borrow(vector_address, i);
            let amount = vector::borrow(vector_amount, i);

            if (*address == caller_address || *amount == 0) {
                return false
            };
            i = i + 1;
        };
        if(i != 0 ){
            return true
        };
        return false
    }
    spec send_batch_transfer<CoinA>(caller:&signer,coin:string::String,coin_address:address,send_coin_amount:u64) {
        pragma verify = true;
    }
    fun send_batch_transfer<CoinA>(caller:&signer,coin:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree, ResourceCap {
        //need to use resource to be caller
        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        assert!(index != 99 , Dont_have_this_cylinder);
        assert!(&create_signer_with_capability(&borrow_global<ResourceCap>(create_resource_address(&@dapp,Garble_Seed)).cap) == caller,NOT_reource_address);
        // let specfic = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index);
        //debug::print(&vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector));
        //debug::print(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_number);
        if( vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector) >= vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_number ) {
            garble_before_send(coin,coin_address,send_coin_amount);
            if (type_info::type_name<CoinA>() == utf8(b"0x1::aptos_coin::AptosCoin") ) {
                let address_vector = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector;
                let amount_vector = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector;
                let i = 0;
                let check = false;
                let length = vector::length(& amount_vector);
                let length2 =vector::length(&address_vector);
                assert!(length == length2, Iuput_of_length_not_same);
                if(length != 0) {
                    while (i < length) {
                        let borrow_address = vector::borrow(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector, i);
                        let borrow_amount = vector::borrow(& vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector, i);
                        assert!(borrow_amount != &0, NO_zero_input);
                        assert!(borrow_address != &signer::address_of(caller), NO_zero_input);


                        if( i == length-1){
                            check = true;
                        };
                        i = i + 1;
                    };
                    // let address_vector =vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).send_address_vector;
                    // let amount_vector = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Garble_Seed)).save_Cylinder_Pairs,index).send_amount_vector;
                    if (check_vectors(caller, &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector, &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector) == true) {

                        if(i != 0){

                            if(check){

                                batch_transfer(caller,address_vector , amount_vector);
                            }
                        };
                    }
                }
            }else {
                let address_vector = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector;
                let amount_vector = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector;
                let i = 0;
                let check = false;
                let length = vector::length(& amount_vector);
                let length2 =vector::length(&address_vector);
                assert!(length == length2, Iuput_of_length_not_same);
                if(length != 0) {
                    while (i < length) {
                        let borrow_address = vector::borrow(&vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector, i);
                        let borrow_amount = vector::borrow(& vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector, i);
                        assert!(borrow_amount != &0, NO_zero_input);
                        assert!(borrow_address != &signer::address_of(caller), NO_zero_input);
                        if( i == length-1){
                            check = true;
                        };
                        i = i + 1;
                    };
                    if (check_vectors(caller, &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector, &vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector) == true) {
                        if(i != 0){
                            if(check){
                                batch_transfer_coins<CoinA>(caller, address_vector, amount_vector);
                            }
                        };
                    }
                }

            };

            let amount = check_total_of_input_vector_amount(vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector);

            vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).already_send = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).already_send + amount;
            vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_total =vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).save_total - amount;

            clean_vector(coin,coin_address,send_coin_amount);
        }
    }


    //////// Pay function ////////

    //////// Logic fun //////////


    fun clean_vector(coin:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree {
        let i = 0;
        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        let length = vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector);
        while (i < length) {
            if (vector::is_empty(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector)) {}else {
                vector::pop_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector);
            };
            if (vector::is_empty(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector)) {}else {
                vector::pop_back(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector);
            };

            i = i + 1;
        }
    }
    fun upgrade_level(caller:&signer) acquires Account_tree {
        borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty=borrow_global_mut<Account_tree>(signer::address_of(caller)).save_5.diffusion_loyalty+1;

    }
    //
    fun garble_before_send(coin:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree {

        let index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        assert!(index != 99 , NOT_exist_cylinder);

        let length = vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector);
        let length2 = vector::length(&vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_amount_vector);
        assert!(length == length2 ,Length_of_two_vector_not_same );

       if(length >=1) {
           let i = length - 1;
           while (i > 0) {
               let random = randomness::u64_range(0, i);
               vector::swap(&mut vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,index).send_address_vector,i,random);
               i = i - 1;
           }
       }
    }

    fun push_vector_to_main_tree(amount:vector<u64>,to_address:vector<address>,coin:string::String,coin_address:address,send_coin_amount:u64) acquires Diffusion_store_tree {
        let coin_index = find_coin_index_in_main_tree(coin,coin_address,send_coin_amount);
        let i =0 ;
        let length = vector::length(&amount);
        if(coin_index!=99){
            let borrow = vector::borrow_mut(&mut borrow_global_mut<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,coin_index);

            while (i < length){
                let amount_specfic = vector::borrow(&amount,i);
                let to_address_specfic = vector::borrow(&to_address,i);

                vector::push_back(&mut borrow.send_address_vector,*to_address_specfic);
                vector::push_back(&mut borrow.send_amount_vector,*amount_specfic);

                i=i+1;
            }
        }
    }
    fun find_coin_index_in_main_tree(coin:string::String,coin_address:address,send_coin_amount:u64):u64 acquires Diffusion_store_tree {
        let i = 0;
        let length = vector::length(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs);
        while(i < length ){
            let borrow = vector::borrow(&borrow_global<Diffusion_store_tree>(create_resource_address(&@dapp,Seed)).save_Cylinder_Pairs,i);
            if((borrow.coin_address == coin_address) && (borrow.coin == coin) && (borrow.pair_number == send_coin_amount)){
                return i
            };
            i=i+1;
        };
        return 99
    }
    fun check_total_of_input_vector_address(amount:vector<address>):u64{
        let i =0;
        let length = vector::length(&amount);
        let total:u64 = 0;
        while(i < length ){
            i=i+1;
        };
        return total
    }
    fun check_total_of_input_vector_amount(amount:vector<u64>):u64{
        let i =0;
        let length = vector::length(&amount);
        let total:u64 = 0;
        while(i < length ){
            let borrow = vector::borrow(&amount,i);
            total=total+*borrow;
            i=i+1;
        };
        return total
    }




    //////// Logic fun //////////
    spec nft_collection_init(caller:&signer,resource_signer:&signer) {
        pragma verify = false;
    }
    fun nft_collection_init(caller:&signer,resource_signer:&signer){

        let royalty = create(15,100,@admin1);  //nft royalty
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

    fun init_module(caller:&signer){
        let (garble_Seed_resource_signer, garble_resource_cap) = account::create_resource_account(
            caller,
            Garble_Seed
        );
        let (helper_resource_signer, helper_resource_cap) = account::create_resource_account(
            caller,
            Helper_Seed
        );
        let (bank_resource_signer, bank_resource_cap) = account::create_resource_account(
            caller,
            Bank_Seed
        );
        let (resource_signer, resource_cap) = account::create_resource_account(
            caller,
            Seed
        );
        move_to(
            &garble_Seed_resource_signer,
            ResourceCap {
                cap:garble_resource_cap
            }
        );

        move_to(&helper_resource_signer,ResourceCap{cap:helper_resource_cap});
        move_to(&bank_resource_signer,ResourceCap{cap:bank_resource_cap});
        move_to(&resource_signer,ResourceCap{cap:resource_cap});
        let diffusion_tree   = Diffusion_store_tree{
            save_Pair_result_store:Pair_result_store{
                save_admin_set_result:vector::empty<bool>(),
                save_can_claim:vector::empty<bool>(),
                save_result:vector::empty<u8>(),
                save_pair:vector::empty<Pair>(),
                save_chips:vector::empty<Chips>(),
                save_lost_pair:smart_vector::new<Ended_pair>(),
                save_user:vector::empty<Save_user_bet>()
            },
            save_Helper_list:Helper_list{
                list:vector::empty<Helper>(),
                period:vector::empty<Helper_allocation>(),
                admin_list:vector::empty<address>()
            },
            fee:Diffusion_fee{
                margin:500000000,
                fees_1:110,
                fees_2:100,
                allocation_share_1:10,
                allocation_share_2:100,
                bank_share_1:20,
                bank_share_2:100,
                nft_chance_1:10,
                nft_chance_2:100,
                nft_id:0
            },
            save_helper_chance:Chance{
                maximun_helper_num:1000,
                heler_number:0,
                least_helper_result:10,
                chance_for_wrong_time:10
            },
            save_Cylinder_Pairs:vector::empty(),
            save_badges_list:vector::empty()
        };
        move_to(&resource_signer,diffusion_tree);
        register<AptosCoin>(&resource_signer);
        register<AptosCoin>(&helper_resource_signer);
        register<AptosCoin>(&bank_resource_signer);
        register<AptosCoin>(&garble_Seed_resource_signer);
        nft_collection_init(caller,&resource_signer);
    }

    // spec create_account_tree {
    //     pragma verify = false; // TODO: see issue <url>
    // }
    // spec publish_package(owner: &signer, pack: PackageMetadata, code: vector<vector<u8>>) {
    //     pragma verify = true;
    // }
    // spec helper {
    //     pragma verify = false; // TODO: set to false because of timeout
    // }
    ////////////////// Cylinder move /////////////////////////////////
}
