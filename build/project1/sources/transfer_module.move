module dapp::transfer_module{

    use aptos_framework::account;
    use aptos_framework::aptos_account::{transfer, transfer_coins};
    use aptos_framework::coin;
    use aptos_framework::coin::is_account_registered;

    friend dapp::pay_module;

    fun check_account_exist(caller:&signer,address:address){
        if(account::exists_at(address)){}else{transfer(caller,address,1);}
    }
    public(friend) fun own_transfer<CoinA>(caller:&signer,address:address,amount:u64){
        check_account_exist(caller,address);
        transfer_coins<CoinA>(caller,address,amount);
    }
}