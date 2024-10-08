
const option_coin_address= {

    option:[
        {
            value:"APT",
            label:"APT",
            address:"0x1",
            coin_url:""
        },
        {
            value:"USDC",
            label:"USDC",
            address:"0x2",
            coin_url:""
        }
    ],
    coin_meta_date:"0x1::fungible_asset::Metadata",
    function:{
        view_v1_coin_symbol:() => '0x1::coin::symbol' as `${string}::${string}::${string}`,
        view_v1_coin_name:() => '0x1::coin::name' as `${string}::${string}::${string}`,
        view_v1_coin_balance:() => '0x1::coin::balance' as `${string}::${string}::${string}`,
        view_v1_coin_decimals:() => '0x1::coin::decimals' as `${string}::${string}::${string}`,
        view_v2_coin_symbol:() => '0x1::fungible_asset::symbol' as `${string}::${string}::${string}`,
        view_v2_coin_name:() => '0x1::fungible_asset::name' as `${string}::${string}::${string}`,
        view_v2_coin_balance:() => '0x1::fungible_asset::balance' as `${string}::${string}::${string}`,
        view_v2_coin_decimals:() => '0x1::fungible_asset::decimals' as `${string}::${string}::${string}`,
        view_v2_coin_icon_url:() => '0x1::fungible_asset::icon_uri' as `${string}::${string}::${string}`,
    }
}

export {option_coin_address}

