module all_or_nothing::badges {

    use std::error;
    use std::option::some;
    use std::signer::address_of;
    use std::string::{utf8, String};
    use all_or_nothing::whitelist;
    use all_or_nothing::package_manager;
    use aptos_token_objects::collection;
    use aptos_token_objects::royalty;

    ///not admin
    const E_not_admin:u64=1;
    struct Badges_details has key,store{
        rarity:String,
        capacity:u64,
        total_number:u64,
        chance:u64,
        url:String
    }
    struct Feator_of_badges has key ,store{
        badges:vector<Badges_details>
    }


    public entry fun init_for_badges_collision(caller:&signer){
        assert!(address_of(caller ) == @admin || address_of(caller) == @admin1 , error::not_implemented(E_not_admin));
        let def_signer =&package_manager::get_signer();
        let collection_const =collection::create_unlimited_collection(def_signer,
            utf8(b"Collision of diffusion Badges"),
        utf8(b"Diffusion Badges"),
           some( royalty::create(1,100,@admin)),
            utf8(b"")
        );
    }

    public entry fun mint_badges(caller:&signer,badges_name:String){
        whitelist::call_mint_badges(caller,badges_name);

    }



    fun find_badges(target:&Badges_details,rarity:String):bool{
        target.rarity==rarity
    }
}
