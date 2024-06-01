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

    //not work on local test ,but should work on tesnet
    fun register_coin(caller:&signer){
        coin::register<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>(caller); //ZUSDC
        coin::register<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>(caller); //USDC
        coin::register<0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T>(caller); //ZUSDT
        coin::register<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>(caller); //USDT
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