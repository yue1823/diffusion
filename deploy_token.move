module all_or_nothing::deploy_token {

    use std::acl::empty;
    use std::error;
    use std::error::not_implemented;
    use std::option;
    use std::option::{Option, none, some};
    use std::signer::address_of;
    use std::string::{String, utf8};
    use std::vector;
    use aptos_std::pool_u64_unbound::new;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_framework::event::emit;
    use aptos_framework::fungible_asset;
    use aptos_framework::fungible_asset::{Metadata, MintRef, BurnRef,TransferRef, MutateMetadataRef,
        generate_mutate_metadata_ref
    };
    use aptos_framework::object;
    use aptos_framework::object::{Object, create_named_object, ExtendRef, object_address, generate_signer_for_extending};
    use aptos_framework::primary_fungible_store;
    use all_or_nothing::liquidity::Pool;
    use aptos_token_objects::token::MutatorRef;
    use all_or_nothing::package_manager::get_signer;
    use all_or_nothing::package_manager;

    friend all_or_nothing::stake;
    friend all_or_nothing::uma;

    /// not authorize
    const E_not_authorize :u64 =1 ;
    /// already exists
    const E_already_exists:u64 =2;
    /// not exists of user
    const E_not_exists:u64 =3;
    /// Metadata not right
    const E_without_this_metadata:u64 =4;
    ///Pool not create
    const E_not_create_pool :u64 =5;

    const Deploy_SEED : vector<u8> = b"deploy";
    const Fixed_amount:u64 = 50000000000000;



    struct CAp_obj has key ,store{
        exten:ExtendRef,
    }
    struct User_data has key,store{
        init_price:u64,
        profit:u64,
    }

    struct REF_token has key ,store {
        seed:vector<u8>,
        metadata:Object<Metadata>,
        muter_ref:MutateMetadataRef,
        mint:MintRef,
        tran:TransferRef,
        burn:BurnRef,
        user_data:SmartTable<address,User_data>
    }
    struct Pair has key,store{
        pending:bool,
        creater:address,
        questioin:String,
        period :u128,
        token_1:REF_token,
        t1_pool:Option<Object<Pool>>,
        token_2:REF_token,
        t2_pool:Option<Object<Pool>>,
    }

    struct Deploy_account has key ,store{
        data:SmartTable<String,Pair>,
        table_name:vector<String>
    }

    #[event]
    struct Create_pair has drop,store,copy{
        table_name:String,
        period:u128,
        token_1_meta:Object<Metadata>,
        token_2_meta:Object<Metadata>
    }

    struct Output has store,drop,copy{
        period:u128,
        token_1_name:vector<u8>,
        token_1_meta:Object<Metadata>,
        pool_1:address,
        token_2_name:vector<u8>,
        token_2_meta:Object<Metadata>,
        pool_2:address,
    }


    #[view]
    public fun get_own_market(owner:address):vector<String> acquires Deploy_account, CAp_obj {
        let borrow = borrow_global<Deploy_account>(address_of(&get_deploy_signer()));
        let length = borrow.table_name.length();
        let re_v = vector::empty<String>();
        for (x in  0..(length-1)){
            let specfic = borrow.data.borrow(borrow.table_name[x]);
            if(specfic.creater == owner){
                re_v.push_back(borrow.table_name[x]);
            }
        };
        re_v
    }


    #[view]
    public fun get_metadata(table_name:String): Output acquires Deploy_account, CAp_obj {
        table_contain(table_name);
        let borrow = &borrow_global<Deploy_account>(address_of(&get_deploy_signer())).data;
        let a= smart_table::borrow(borrow,table_name);

        assert!(a.t1_pool.is_none() == false && a.t2_pool.is_none() == false,not_implemented(E_not_create_pool));

        let pair =Output{
            period:a.period,
            token_1_name:a.token_1.seed,
            token_1_meta:a.token_1.metadata,
            pool_1:object_address(a.t1_pool.borrow()),
            token_2_name:a.token_2.seed,
            token_2_meta:a.token_2.metadata,
            pool_2:object_address(a.t1_pool.borrow())
        };
        pair
    }
    #[view]
    public fun get_all_table_name():vector<String> acquires Deploy_account, CAp_obj {
        let borrow = &borrow_global<Deploy_account>(address_of(&get_deploy_signer())).table_name;
        let new_v = vector::empty<String>();
        let length = vector::length(borrow);
        for(x in 0..(length-1)){
            vector::push_back(&mut new_v,*vector::borrow(borrow,x))
        };
        new_v
    }
    public fun get_metadata_from_output(output:Output):(Object<Metadata>,Object<Metadata>){
        (output.token_1_meta,output.token_2_meta)
    }
    public fun get_seed_from_output(output:Output):(vector<u8>,vector<u8>){
        (output.token_1_name,output.token_2_name)
    }

    inline fun table_contain (table_name:String){
        assert!( smart_table::contains(&borrow_global_mut<Deploy_account>(address_of(&get_deploy_signer())).data,table_name) == true,error::not_implemented(E_not_exists));
    }

   public fun admin_authorize (caller:&signer){
        assert!(address_of(caller) == @admin || address_of(caller) == @admin1 || address_of(caller) == @all_or_nothing,error::permission_denied(E_not_authorize));
    }
    inline fun get_deploy_signer():signer{
        generate_signer_for_extending(&borrow_global<CAp_obj>(object::create_object_address(&address_of(&get_signer()),Deploy_SEED)).exten)
    }


    fun init_module(caller:&signer){
        let all_signer = &package_manager::get_signer();
        let conf = create_named_object(all_signer,Deploy_SEED);
        move_to(&object::generate_signer(&conf),CAp_obj{
            exten:object::generate_extend_ref(&conf),
        });
        move_to(&object::generate_signer(&conf),Deploy_account{
            data:smart_table::new(),table_name:vector[]
        })
    }



    public fun deployer_two_FA(caller:&signer,q:String,token_name_1:vector<u8>,token_name_2:vector<u8>,token_url_1:String,token_url_2:String,period:u128,table_name:String):(Object<Metadata>,Object<Metadata>) acquires CAp_obj, Deploy_account {
        //admin_authorize(caller);
        let object_signer = &get_deploy_signer();
        let token1_conf =create_named_object(object_signer,token_name_1);
        let token2_conf = create_named_object(object_signer,token_name_2);

        primary_fungible_store::create_primary_store_enabled_fungible_asset(&token1_conf,option::none(),utf8(token_name_1),utf8(token_name_1),8,token_url_1,utf8(b""));
        primary_fungible_store::create_primary_store_enabled_fungible_asset(&token2_conf,option::none(),utf8(token_name_2),utf8(token_name_2),8,token_url_2,utf8(b""));

        let token_mint_1 = fungible_asset::generate_mint_ref(&token1_conf);
        let token_trans_1 = fungible_asset::generate_transfer_ref(&token1_conf);
        let token_burn_1 = fungible_asset::generate_burn_ref(&token1_conf);

        let token_mint_2 = fungible_asset::generate_mint_ref(&token2_conf);
        let token_trans_2 = fungible_asset::generate_transfer_ref(&token2_conf);
        let token_burn_2 = fungible_asset::generate_burn_ref(&token2_conf);

        let (r1,r2)=(object::object_from_constructor_ref<Metadata>(&token1_conf),object::object_from_constructor_ref<Metadata>(&token2_conf));

        primary_fungible_store::mint(&token_mint_1,address_of(object_signer),Fixed_amount);
        primary_fungible_store::mint(&token_mint_2,address_of(object_signer),Fixed_amount);

        let token_1_ref =REF_token{
            seed:token_name_1,
            metadata:object::object_from_constructor_ref<Metadata>(&token1_conf),
            muter_ref:generate_mutate_metadata_ref(&token1_conf),
            mint:token_mint_1,
            tran:token_trans_1,
            burn:token_burn_1,
            user_data:smart_table::new<address,User_data>()
        };
        let token_2_ref =REF_token{
            seed:token_name_2,
            metadata:object::object_from_constructor_ref<Metadata>(&token2_conf),
            muter_ref:generate_mutate_metadata_ref(&token2_conf),
            mint:token_mint_2,
            tran:token_trans_2,
            burn:token_burn_2,
            user_data:smart_table::new<address,User_data>()
        };

        let new_pair = Pair{
            pending:false,
            creater:address_of(caller),
            questioin:q,
            period:period,
            token_1:token_1_ref,
            t1_pool:none<Object<Pool>>(),
            token_2:token_2_ref,
            t2_pool:none<Object<Pool>>()
        };
        let borrow = borrow_global_mut<Deploy_account>(address_of(object_signer));
        assert!( smart_table::contains(&borrow.data,table_name) == false,error::not_implemented(E_already_exists));
        smart_table::add(&mut borrow.data,table_name,new_pair);
        borrow.table_name.push_back(table_name);


        emit(Create_pair{
            table_name,
            period,
            token_1_meta:object::object_from_constructor_ref<Metadata>(&token1_conf),
            token_2_meta:object::object_from_constructor_ref<Metadata>(&token2_conf)
        });
        return (r1,r2)
    }
    public entry fun set_url(caller:&signer,url:String){

    }
    public(friend) fun set_pair_pool(pool:Object<Pool>,fa:Object<Metadata>,table_name:String) acquires Deploy_account, CAp_obj {
        let borrow = borrow_global_mut<Deploy_account>(address_of(&get_deploy_signer()));
        let pair =borrow.data.borrow_mut(table_name);
        assert!(pair.token_2.metadata == fa || pair.token_1.metadata == fa,not_implemented(E_without_this_metadata));
        if (pair.token_1.metadata == fa){
            pair.t1_pool = some(pool);
        }else {
            pair.t2_pool= some(pool);
        }
    }

    public(friend) fun get_pair_details(table_name:String):(address,Object<Metadata>,address,Object<Metadata>,String,u128) acquires Deploy_account, CAp_obj {
        let output = get_metadata(table_name);
        (output.pool_1,output.token_1_meta,output.pool_2,output.token_2_meta,table_name,output.period)
    }
    public(friend) fun start_pending(table_name:String) acquires Deploy_account, CAp_obj {
        let borrow = borrow_global_mut<Deploy_account>(address_of(&get_deploy_signer()));
        let pair =borrow.data.borrow_mut(table_name);
        if(!pair.pending){
            pair.pending = true
        }
    }
    #[view]
    public fun is_pending(table_name:String):bool acquires Deploy_account, CAp_obj {
        let borrow = borrow_global_mut<Deploy_account>(address_of(&get_deploy_signer()));
        let pair =borrow.data.borrow_mut(table_name);
        pair.pending
    }

    public(friend) fun burn_some(obj:Object<Metadata>,balance:u256,table_name:String) acquires Deploy_account, CAp_obj {
        let borrow = borrow_global<Deploy_account>(address_of(&get_deploy_signer()));
        let pair =borrow.data.borrow(table_name);

    }
}
