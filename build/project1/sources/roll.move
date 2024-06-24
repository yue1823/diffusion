module dapp::roll {
    use std::hash;
    use std::signer;
    use std::string::utf8;
    use aptos_std::aptos_hash;
    use aptos_std::debug;
    use aptos_framework::account::create_resource_address;
    use aptos_framework::randomness;
    use aptos_framework::randomness_api_v0_config;

    const Seed:vector<u8> = b"asf";
   friend dapp::pay_module;

    #[event]
    struct WinningNum has drop, store {
        n: u8,
    }
    struct Randomness_store has key{
        first : u128 ,
        second : u128
    }

    // #[randomness]
    // public(friend) entry fun play(account: &signer) {
    //     let rnd = randomness::u64_integer();
    //     let rnd2 = randomness::u64_integer();
    //     let n = ((rnd % 1000) as u256) + 1;
    //     let n2 = ((rnd2 % 1000) as u256) + 1;
    //     if(n ==  n2){
    //         debug::print(&utf8(b"you are lucky "));
    //     }else{
    //         debug::print(&utf8(b"bad luck "));
    //     }
    // }

    // #[randomness]
    // entry fun save_randome(caller:&signer)  {
    //     assert!(signer::address_of(caller) == @dapp, 0);
    //     let a = randomness::u128_integer();
    //     let b = randomness::u128_integer();
    //     move_to(caller,Randomness_store{
    //         first:a,
    //         second:b,
    //     })
    // }

    public(friend)  fun lottery2(caller:&signer):bool acquires Randomness_store {
        let borrow = borrow_global<Randomness_store>(create_resource_address(&@dapp,Seed));
        let n = (borrow.first%1000 as u256)+1;
        let n2 = (borrow.second%1000 as u256)+1;
        if(n==n2){
           true
        }else{false}
    }


    // fun init_module(caller:&signer){
    //     save_randome(caller);
    // }

    // #[randomness]
    // public(friend) entry fun lottery(account: &signer){
    //     let rnd = randomness::u64_integer();
    //     let rnd2 = randomness::u64_integer();
    //     if(rnd ==  rnd2){
    //         pay_module::mint(account);
    //     }else{}
    // }

    // #[test(aptos_framework=@aptos_framework,caller=@0x1)]
    // fun test_roll(aptos_framework:&signer,caller:&signer){
    //
    //     play(caller);
    // }
}