export const NODE_URL = process.env.APTOS_NODE_URL || "https://aptos-devnet.pontem.network";
export const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

export const RESOURCE_ACCOUNT = "0xf5f11a0fa0ef6e2cd215d73cc3bd3c4cc2ad5b1c24625a690aadc9b13a57eaff";
export const MODULES_ACCOUNT = "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9";

export const TokensMapping = {
    APTOS:'0x1::aptos_coin::AptosCoin', // APTOS
    USDC:'0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC', //devnet USDT
    USDT:'0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
};

export type TxPayloadCallFunction = {
    type: 'entry_function_payload';
    function: string;
    type_arguments: string[];
    arguments: string[];
};

export const NETWORKS_MAPPING = {
    TESTNET: 'testnet',
    DEVNET: 'devnet',
    MAINNET: 'mainnet'
};