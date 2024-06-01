module 0x6::init_module{

    use std::option;
    use std::string;
    use std::string::{String,utf8};
    use aptos_framework::account;
    use aptos_framework::account::create_resource_address;
    use aptos_framework::coin;

    use aptos_framework::coin::Coin;
    use aptos_framework::object;
    use aptos_framework::resource_account::{create_resource_account, create_resource_account_and_fund};
    use aptos_token_objects::collection::MutatorRef;
    use aptos_token_objects::collection;
    use aptos_token_objects::royalty::{create, Royalty};


    const Collection_name:vector<u8> = b"";
    const Description_nft:vector<u8> = b"Fist collection of our dapp (I won't sell it lower than 1 APT ^_^) ";
    const Name_nft:vector<u8> = b"";
    const Url_nft:vector<u8> = b"";


    struct CollectionRefsStore has key{

        mutator_ref:collection::MutatorRef,

    }

    fun init(caller : &signer){

        register_coin(caller);
        nft_collection_init(caller);

    }


    fun register_coin(caller:&signer){

    }
    fun nft_collection_init(caller:&signer){
        let (resource_signer , resource_cap) = account::create_resource_account(caller,Collection_name);
        let royalty = create(10,100,@admin1);  //nft royalty
        let collection=collection::create_unlimited_collection(             //create collection
            &resource_signer,
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

}