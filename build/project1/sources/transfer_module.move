module dapp::transfer_module{

    use std::signer;
    use aptos_framework::account;
    use aptos_framework::aptos_account::{transfer, transfer_coins};
    use aptos_framework::coin;
    use aptos_framework::coin::is_account_registered;
    const Address_same_with_caller:u64 = 20;
    const Check_account_exist_address_same_with_caller :u64 =21;

    friend dapp::pay_module;

    fun check_account_exist(caller:&signer,address:address){
        assert!(signer::address_of(caller)!=address,Check_account_exist_address_same_with_caller );
        if(account::exists_at(address)){}else{transfer(caller,address,1);}
    }
    public(friend) fun own_transfer<CoinA>(caller:&signer,address:address,amount:u64){
        assert!(signer::address_of(caller)!=address,Address_same_with_caller);
        check_account_exist(caller,address);
        transfer_coins<CoinA>(caller,address,amount);
    }
}