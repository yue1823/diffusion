module all_or_nothing::package_manager {

    use std::option::{none, Option};
    use aptos_framework::object;
    use aptos_framework::object::{DeleteRef, ExtendRef, TransferRef};

    const Seed :vector<u8> = b"all or nothing";
    const Limit_Seed:vector<u8> =b"limit";

    friend all_or_nothing::liquidity;
    friend all_or_nothing::limit;
    friend all_or_nothing::badges;
    friend all_or_nothing::whitelist;
    friend all_or_nothing::account;
    friend all_or_nothing::deploy_token;
    friend all_or_nothing::stake;
    friend all_or_nothing::uma;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Cap_of_obj has key,store{
        tran_cap:TransferRef,
        exten_cap:ExtendRef,
        del_cap:Option<DeleteRef>
    }

    public(friend) fun get_signer():signer acquires Cap_of_obj {
        let extendref = &borrow_global<Cap_of_obj>(object::create_object_address(&@all_or_nothing,Seed)).exten_cap;
        let sig = object::generate_signer_for_extending(extendref);
        return sig
    }
    public(friend) fun get_limit_signer():signer acquires Cap_of_obj {
        let extendref = &borrow_global<Cap_of_obj>(object::create_object_address(&@all_or_nothing,Limit_Seed)).exten_cap;
        let sig = object::generate_signer_for_extending(extendref);
        return sig
    }

     fun init_module(caller:&signer){
        let conf = &object::create_named_object(caller,Seed);
        let obj_signer = object::generate_signer(conf);
        let tran_ref = object::generate_transfer_ref(conf);
        let del_ref = none<DeleteRef>();
        let exten_ref = object::generate_extend_ref(conf);
        move_to(&obj_signer,Cap_of_obj{
            tran_cap:tran_ref,
            exten_cap:exten_ref,
            del_cap:del_ref
        });

         let conf = &object::create_named_object(caller,Limit_Seed);
         let obj_signer = object::generate_signer(conf);
         let tran_ref = object::generate_transfer_ref(conf);
         let del_ref = none<DeleteRef>();
         let exten_ref = object::generate_extend_ref(conf);
         move_to(&obj_signer,Cap_of_obj{
             tran_cap:tran_ref,
             exten_cap:exten_ref,
             del_cap:del_ref
         });
    }

    #[test_only]
    public fun call_package_init(caller:&signer){
        init_module(caller);
    }
}
