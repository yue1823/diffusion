module 0x6::test_module{
    #[test_only]
    use std::signer;
    #[test_only]
    use std::string;
    #[test_only]
    use aptos_std::debug;
    #[test_only]
    use aptos_std::debug::print;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::aptos_account;
    #[test_only]
    use aptos_framework::aptos_coin::AptosCoin;
    #[test_only]
    use aptos_framework::coin;
    #[test_only]
    use aptos_framework::coin::BurnCapability;
    #[test_only]
    use aptos_framework::timestamp;

    #[test_only]
    fun setup(aptos_framework: &signer, sponsor: &signer,second:&signer): BurnCapability<AptosCoin> {
        timestamp::set_time_has_started_for_testing(aptos_framework);

        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
            aptos_framework,
            string::utf8(b"TC"),
            string::utf8(b"TC"),
            8,
            false,
        );
        account::create_account_for_test(signer::address_of(sponsor));
        coin::register<AptosCoin>(sponsor);
        account::create_account_for_test(signer::address_of(second));
        coin::register<AptosCoin>(second);
        let coins = coin::mint<AptosCoin>(2000, &mint_cap);
        coin::deposit(signer::address_of(sponsor), coins);
        let coins_1 = coin::mint<AptosCoin>(2000, &mint_cap);
        coin::deposit(signer::address_of(second), coins_1);
        coin::destroy_mint_cap(mint_cap);
        coin::destroy_freeze_cap(freeze_cap);

        burn_cap
    }

    // #[test(aptos_framework = @0x1, sponsor = @0x123,second=@0x2222)]
    // public entry fun test_claim_coins(
    //     aptos_framework: &signer, sponsor: &signer , second:&signer){
    //     let burn_cap = setup(aptos_framework, sponsor,second);
    //     debug::print(&coin::balance<AptosCoin>(signer::address_of(sponsor)));
    //     debug::print(&coin::balance<AptosCoin>(signer::address_of(second)));
    //     coin::destroy_burn_cap(burn_cap);
    // }

}