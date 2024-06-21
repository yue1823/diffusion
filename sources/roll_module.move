module dapp::roll {
    use std::signer;
    use std::string::utf8;
    use aptos_std::debug;
    use aptos_framework::randomness;


   friend dapp::pay_module;

    #[event]
    struct WinningNum has drop, store {
        n: u8,
    }

    #[randomness]
    public(friend) entry fun play(account: &signer) {
        let rnd = randomness::u64_integer();
        let rnd2 = randomness::u64_integer();
        let n = ((rnd % 1000) as u256) + 1;
        let n2 = ((rnd2 % 1000) as u256) + 1;
        if(n ==  n2){
            debug::print(&utf8(b"you are lucky "));
        }else{
            debug::print(&utf8(b"bad luck "));
        }
    }
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