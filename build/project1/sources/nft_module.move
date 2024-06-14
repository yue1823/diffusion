module dapp::nft_module{
    use std::string;
    use std::option;
    use aptos_framework::keyless_account;
    use aptos_token_objects::token;
    use aptos_token_objects::collection;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::object::{Self,Object, LinearTransferRef,DeleteRef};

    const Collection_name:vector<u8> =b"";

    struct Reward has key {

    }

    struct CollectionRefsStore has key{

        mutator_ref:collection::MutatorRef,

    }
    #[event]
    struct Collection has store,key,drop {
        owner:address,
        token_id:address,

    }
    struct Resoucecap has key{
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


}