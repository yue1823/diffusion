module dapp::roll {
    use std::signer;
    use std::string::utf8;
    use aptos_std::debug;
    use aptos_framework::randomness;
    use  dapp::nft_module;
    use dapp::pay_module;


    #[event]
    struct WinningNum has drop, store {
        n: u8,
    }

    #[randomness]
    entry fun play(account: &signer) {
        assert!(signer::address_of(account) != @dapp, 0);

        let rnd = randomness::u64_integer();
        let n = ((rnd % 10) as u8) + 1;
        debug::print(&utf8(b"rnd value : "));
        debug::print(&rnd);
        debug::print(&utf8(b"n value : "));
        debug::print(&n);

        0x1::event::emit(WinningNum {
            n
        });
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