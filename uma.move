module all_or_nothing::uma {

    use std::error::not_implemented;
    use std::option::{Option, none};
    use std::signer::address_of;
    use std::string::String;
    use aptos_std::smart_table;
    use aptos_std::smart_table::{SmartTable, new};
    use aptos_std::smart_vector::{SmartVector, empty};
    use aptos_framework::fungible_asset;
    use aptos_framework::fungible_asset::Metadata;
    use aptos_framework::object::{Object, address_to_object, create_named_object, ExtendRef, generate_signer,
        generate_extend_ref, create_object_address, create_object, address_from_constructor_ref
    };
    use aptos_framework::primary_fungible_store;
    use aptos_framework::primary_fungible_store::deposit;
    use aptos_framework::timestamp::now_seconds;
    use all_or_nothing::package_manager::get_signer;
    use all_or_nothing::package_manager;
    use all_or_nothing::liquidity::{Pool, get_balance, draw_all_token};
    use all_or_nothing::liquidity;
    use all_or_nothing::deploy_token::{get_pair_details, start_pending, is_pending};

    const UMA_SEED :vector<u8>=b"uma";

    ///Pair ongoing
    const E_ongoing_pair :u64 =1;
    ///Alreadt Pending
    const E_pending_already:u64 =2;
    ///Chanllenging time
    const E_on_challening:u64 =3;
    ///Wrong Metadate
    const E_wrong_metadata:u64 =4;
    ///Same vote
    const E_same_vote:u64 =5;
    ///Limit error
    const E_limit_error:u64 = 6;

    const Fixed_time:u128 = 86400;

    struct Control_cap has key,store{
        exten_ref:ExtendRef
    }

    struct Pending_tree has key,store{
        pending_v:SmartTable<String,Process>,
        challengeing_v:SmartTable<String,Process>,
        end_pair:SmartVector<Process>
    }
    struct Process has key,store{
        t1_pool:address,
        t1:Object<Metadata>,
        t2_pool:address,
        t2:Object<Metadata>,
        t1_share_t:u256,
        t1_share_c:u256,
        t2_share_t:u256,
        t2_share_c:u256,
        each_coin_share:u256,
        period:u128,
        table_name:String,
        t2_vote:u128,
        t1_vote:u128,
        claimable:bool,
        challengeing:bool,
        claim_address:Option<ExtendRef>
    }
    #[event]
    struct Pending_state has copy,store,drop{

    }

    public fun challenge(caller:&signer){}
    public fun vote(caller:&signer,power:u128){}
    public fun claim(caller:&signer,table_name:String,in:Object<Metadata>) acquires Pending_tree {
        let is_pending = is_pending(table_name);
        let(pool1,t1,pool2,t2,table_name1,period)= get_pair_details(table_name);
        if(is_pending == false && (now_seconds() as u128) >= period){
            return generate_result(table_name)
        };
        let borrow = borrow_global_mut<Pending_tree>(create_object_address(&address_of(&package_manager::get_signer()),UMA_SEED));
        let  p=borrow.pending_v.borrow_mut(table_name);
        if((now_seconds() as u128) - p.period >= Fixed_time && p.claimable == false){
            return claim_setting(p)
        };
        assert!((now_seconds() as u128) - p.period >= Fixed_time ,not_implemented(E_on_challening));
        assert!(in == p.t1 || in ==p.t2,not_implemented(E_wrong_metadata));
        assert!(p.challengeing == false ,not_implemented(E_on_challening));
        let user_balance = primary_fungible_store::balance(address_of(caller),in);


    }

    fun claim_setting(p:&mut Process){
        p.claimable = true ;
        let (token_total,total_prize) = if(p.t1_vote > p.t2_vote) {
            let lose = p.t2_share_c;
            (p.t1_share_t,(p.t1_share_c + lose * 8 / 10))
        }else if(p.t2_vote > p.t1_vote){
            let lose = p.t1_share_c;
            (p.t2_share_t,(p.t2_share_c + lose * 8 / 10))
        }else{
            abort E_same_vote
        };
        let out_1 = draw_all_token(address_to_object<Pool>(p.t1_pool),p.t1,p.t1_share_c);
        let out_2 = draw_all_token(address_to_object<Pool>(p.t2_pool),p.t2,p.t2_share_c);
        let new_obj_conf = create_object(address_of(&get_signer()));
        let new_exten = (generate_extend_ref(&new_obj_conf));

        let (limit_fa,out_fa_1) = if(p.t1_vote > p.t2_vote){
            let balance = fungible_asset::amount(&out_2) * 8 /10;
            (fungible_asset::extract(&mut out_2,balance),out_2)
        }else if (p.t2_vote > p.t1_vote){
            let balance = fungible_asset::amount(&out_1) * 8 /10;
            (fungible_asset::extract(&mut out_1,balance),out_1)
        }else{
            abort E_limit_error
        };





        primary_fungible_store::deposit(address_from_constructor_ref(&new_obj_conf),out_1);
        primary_fungible_store::deposit(address_from_constructor_ref(&new_obj_conf),out_2);
        p.claim_address.swap(new_exten);

    }

    fun init_module(caller:&signer){
        let obj_conf = create_named_object(&package_manager::get_signer(),UMA_SEED);
        let obj_signer =generate_signer(&obj_conf);
        move_to(&obj_signer,Control_cap{exten_ref:generate_extend_ref(&obj_conf)});
        move_to(&obj_signer,Pending_tree{
            pending_v:new<String,Process>(),
            challengeing_v:new<String,Process>(),
            end_pair:empty<Process>()
        });
    }
    public fun generate_result(table_name:String) acquires Pending_tree {
        let is_pending = is_pending(table_name);
        assert!(is_pending == false,not_implemented(E_pending_already));
        let(pool1,t1,pool2,t2,table_name1,period)= get_pair_details(table_name);
        assert!(now_seconds() >= (period as u64),not_implemented(E_ongoing_pair));
        start_pending(table_name);
        let(t1_share_t,t1_share_c)=get_balance(address_to_object<Pool>(pool1),t1);
        let(t2_share_t,t2_share_c)=get_balance(address_to_object<Pool>(pool2),t2);
        let new_process = Process{
            t1_pool:pool1,
            t1,
            t2_pool:pool2,
            t2,
            t1_share_t,
            t1_share_c,
            t2_share_t,
            t2_share_c,
            each_coin_share:0,
            period,
            table_name,
            t1_vote:0,
            t2_vote:0,
            claimable:false,
            challengeing:false,
            claim_address:none<ExtendRef>()
        };
        let borrow = borrow_global_mut<Pending_tree>(create_object_address(&address_of(&package_manager::get_signer()),UMA_SEED));
        borrow.pending_v.add(table_name,new_process);
    }

}
