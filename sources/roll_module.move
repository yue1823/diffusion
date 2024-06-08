module roll::roll {
    use std::signer;
    use aptos_framework::randomness;

    #[event]
    struct WinningNum has drop, store {
        n: u8,
    }

    #[randomness]
    entry fun play(account: &signer) {
        assert!(signer::address_of(account) == @roll, 0);

        let rnd = randomness::u64_integer();
        let n = ((rnd % 10) as u8) + 1;

        0x1::event::emit(WinningNum {
            n
        });
    }
}