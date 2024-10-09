import Pontem_logo from "../logo/Pontem.svg"
import {Image} from "antd";
import Thala_logo from "../logo/thala logo.jpeg";
import Cellea_logo from "../logo/cellana.svg";
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
            coin_url:"https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=035",
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
    },
    segmented_options:[
        {
            label: (
                <div style={{ padding: 4 }}>
                    <Image src={Pontem_logo} preview={false} style={{width:"30px",height:"30px",transform:"scale(2)",top:4,position:"inherit"}}></Image>
                    <p>Pontem</p>
                </div>
            ),
            value: 'Pontem',
        },
        {
            label: (
                <div style={{ padding: 4 }}>
                    <Image src={Thala_logo} preview={false} style={{width:"30px",height:"30px",transform:"scale(1.3)",top:4,position:"inherit",borderRadius:"50%"}}></Image>
                    <p>Thala</p>
                </div>
            ),
            value: 'Thala',
        },
        {
            label: (
                <div style={{ padding: 4 }}>
                    <Image src={Cellea_logo} preview={false} style={{width:"30px",height:"30px",transform:"scale(1.3)",top:4,position:"inherit",borderRadius:"50%"}}></Image>
                    <p>Cellea</p>
                </div>
            ),
            value: 'Cellea',
            disabled: true
        },
    ]
}

export {option_coin_address}

