
const option_coin_address= {

    option:[
        {
            value:"APT",
            label:"APT",
            address: "0x1::aptos_coin::AptosCoin",
            coin_url:"https://cryptologos.cc/logos/aptos-apt-logo.svg?v=035",
            decimals:8,
        },
        {
            value:"USDC",
            label:"USDC",
            address:"0x625291f4e529c4315830dcdadaae8a78202e326a32d565eb415539d989d8bc4a::GWC::GWC",
            coin_url:"",
            decimals:8,
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
        view_v2_coin_balance:() => '0x1::primary_fungible_store::balance' as `${string}::${string}::${string}`,
        view_v2_coin_decimals:() => '0x1::fungible_asset::decimals' as `${string}::${string}::${string}`,
        view_v2_coin_icon_url:() => '0x1::fungible_asset::icon_uri' as `${string}::${string}::${string}`,
    }
}

export {option_coin_address}

