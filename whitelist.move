module all_or_nothing::whitelist {

    use std::error;
    use std::signer::address_of;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_framework::event::emit;
    use aptos_framework::object;
    use aptos_framework::object::{generate_signer, ExtendRef};
    use all_or_nothing::package_manager;

    friend all_or_nothing::badges;

    const Seed :vector <u8> =b"whitelis";
    ///Not admin
    const E_not_admin:u64 =1 ;
    ///Not exits person
    const E_not_exits:u64=2;
    ///not whitelist
    const E_not_whitelist:u64=3;

    struct Capbability_control has key,store{
        ext:ExtendRef
    }
    struct Badges has key,store,copy,drop{
        Badges_name:String,
    }
    struct Whitelist has key,store {
        list:SmartTable<address,vector<Badges>>
    }
    #[event]
    struct Add_whitelist has store,drop{
        allow_address:vector<address>,
        badges:String
    }
    #[event]
    struct Remove_bages has store,drop{
        owner:address,
        badges:String
    }

    public entry fun init_whitelist(caller:&signer){
        assert!(address_of(caller) == @admin || address_of(caller) == @admin1,error::not_implemented(E_not_admin));
        let obj_con = object::create_named_object(&package_manager::get_signer(),Seed);
        let obj_signer =&generate_signer(&obj_con);
        move_to(obj_signer,Capbability_control{
            ext:object::generate_extend_ref(&obj_con)
        });
        move_to(obj_signer,Whitelist{
            list:smart_table::new<address,vector<Badges>>()
        })

    }


    public entry fun add_whitelist(caller:&signer,badges_name:String,allowa_ddress:vector<address>) acquires Whitelist {
        assert!(address_of(caller) == @admin || address_of(caller) == @admin1,error::not_implemented(E_not_admin));
        let borrow = borrow_global_mut<Whitelist>(object::create_object_address(&address_of(&package_manager::get_signer()),Seed));
        let i =0;
        let length = vector::length(&allowa_ddress);
        while(i < length){

            let badges =make_a_bages(badges_name);
            let specfic_address = vector::borrow(&allowa_ddress,i);
            if (smart_table::contains(&mut borrow.list,*specfic_address)){
               let a=smart_table::borrow_mut(&mut borrow.list,*specfic_address);
                vector::push_back(a,badges);
            }else{
                let emv = vector::empty<Badges>();
                vector::push_back(&mut emv,badges);
                smart_table::add(&mut borrow.list,*specfic_address,emv);
            };
            i= i + 1 ;
        };
        emit(Add_whitelist{
            allow_address:allowa_ddress,
            badges:badges_name
        });
    }

    public(friend) fun call_mint_badges(caller:&signer,badges_name:String) acquires Whitelist {
        let borrow = borrow_global_mut<Whitelist>(object::create_object_address(&address_of(&package_manager::get_signer()),Seed));
        assert!(smart_table::contains(&borrow.list ,address_of(caller)) == true ,error::not_implemented(E_not_exits));
        let ev = smart_table::borrow_mut(&mut borrow.list,address_of(caller));
        let (have ,index)=vector::find(ev,|target|find_badges(target,badges_name));
        assert!(have == true ,error::not_implemented(E_not_whitelist));
        vector::remove<Badges>(ev,index);
        emit(Remove_bages{
            owner:address_of(caller),
            badges:badges_name
        });
    }

    public fun find_badges(target:&Badges,badges_name:String):bool{
        target.Badges_name == badges_name
    }


    fun make_a_bages(badges_name:String):Badges{
        Badges{Badges_name:badges_name}
    }

}
