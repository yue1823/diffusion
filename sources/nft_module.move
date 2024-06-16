module dapp::nft_module{
    use std::string;
    use std::option;
    use std::signer;
    use std::string::{utf8, String};
    use aptos_std::debug;
    use aptos_std::string_utils;
    use aptos_framework::keyless_account;
    use aptos_token_objects::token;
    use aptos_token_objects::collection;
    use aptos_framework::account::{SignerCapability, create_resource_address, create_signer_with_capability};
    use aptos_framework::object::{Self,Object, LinearTransferRef,DeleteRef};
    use aptos_token_objects::aptos_token;
    use aptos_token_objects::royalty::create;
    use aptos_token_objects::token::Token;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::aptos_coin::AptosCoin;
    #[test_only]
    use aptos_framework::coin;
    #[test_only]
    use aptos_framework::timestamp;

    const Seed:vector<u8> = b"asf";
    const Collection_name:vector<u8> =b"Diffusion collection";
    const Collection_name_token_describe:vector<u8> =b"You are really lucky to get this one XD ";
    const TokenPrefix: vector<u8> = b"mfer #";
    const Url_nft:vector<u8> = b"https://pot-124.4everland.store/diffusion.jpeg";
    struct TokenRefsStore has key {
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
        extend_ref: object::ExtendRef,
        transfer_ref: option::Option<object::TransferRef>
    }

    struct Reward has key {
        id : u8,
    }

    struct CollectionRefsStore has key{

        mutator_ref:collection::MutatorRef,

    }
    #[event]
    struct Collection has store,key,drop {
        owner:address,
        token_id:address,

    }
    struct ResourceCap has key{
        cap:SignerCapability
    }
    struct Tokenstore has key{
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
        transfer_ref: option::Option<object::TransferRef>
    }
    #[event]
    struct BurnEvent has drop, store {
        owner: address,
        token_id: address,

    }

    fun mint(caller:&signer) acquires ResourceCap, Reward {

        let borrow = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;

        let borrow1 = borrow_global<Reward>(create_resource_address(&@dapp,Seed));

        let resource_signer = create_signer_with_capability(borrow);

        let resource_address = signer::address_of(&resource_signer);

        let c =utf8(b"___#");
        let d =  string::utf8(Collection_name_token_describe);

        string::append(&mut d,c);
        debug::print(&utf8(b"1"));
        string::append( &mut d,string_utils::to_string(&borrow1.id));
        borrow1.id+1;
        debug::print(&utf8(b"2"));
        let token_cref = token::create_numbered_token(
            &resource_signer,
            string::utf8(Collection_name),
            d,
            string::utf8(TokenPrefix),
            string::utf8(b""),
            option::some(create(15,100,@admin1)),
            string::utf8(Url_nft),
        );
        debug::print(&utf8(b"3"));

        let token_signer = object::generate_signer(&token_cref);
        let token_mutator_ref = token::generate_mutator_ref(&token_cref);
        let token_burn_ref = token::generate_burn_ref(&token_cref);
        debug::print(&utf8(b"4"));
        move_to(
            &token_signer,
            TokenRefsStore {
                mutator_ref: token_mutator_ref,
                burn_ref: token_burn_ref,
                extend_ref: object::generate_extend_ref(&token_cref),
                transfer_ref: option::none()
            }
        );
        debug::print(&utf8(b"5"));
        object::transfer(
            &resource_signer,
            object::object_from_constructor_ref<Token>(&token_cref),
            signer::address_of(caller),
        );
        debug::print(&utf8(b"6"));
    }
    ///################################################///

    #[test(aptos_framework=@aptos_framework,caller=@dapp,first=@0x1)]
    fun test_mint_nft(aptos_framework: &signer, caller: &signer,first:&signer) acquires ResourceCap, Reward {
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
        account::create_account_for_test(signer::address_of(first));
        coin::register<AptosCoin>(first);
        coin::destroy_mint_cap(mint_cap);
        coin::destroy_freeze_cap(freeze_cap);
        coin::destroy_burn_cap(burn_cap);
        init(caller);
        mint(first);

    }

    #[test_only]
    fun init(caller:&signer){
        let (resource_signer, resource_cap) = account::create_resource_account(
            caller,
            Seed
        );
        move_to(&resource_signer,ResourceCap{cap:resource_cap});
        move_to(&resource_signer,Reward{id:0});
        let royalty = create(10,100,@admin1);  //nft royalty
        let collection=collection::create_unlimited_collection(             //create collection
            &resource_signer,
            utf8(Collection_name),
            utf8(Collection_name_token_describe),
            option::some(royalty),
            utf8( Url_nft)
        );
        let collection_signer =  object::generate_signer(&collection);
        let mutator_ref = aptos_token_objects::collection::generate_mutator_ref(&collection);
        move_to(&collection_signer,
            CollectionRefsStore{
                mutator_ref});
    }


}