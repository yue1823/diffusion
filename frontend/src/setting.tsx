import {AptosConfig, Network } from "@aptos-labs/ts-sdk";
export const  diffusion = {
    module_address:"0x7776f4ac2f3a13f751b966220b0e68e0b5688682c31e4f93cbf12ce1cea4a7b9",
    resources_address:"0x8e1610bc1fe8556c7e839f6afc1d420db7fa50fd7251adfb0e11aeb8516bae77",
    garble_address:"0x987876fa678f2f8097b57b2b7a2d9689144455052802e1ab46b4363d12768115",
    Bank_address:"0xf711fef606b3114ee9d6f718d8c6a209eccc362dc8b1af31372d4c73a833e5be",
    Helper_address:"0x5ec0ff7e30c95dc7f6610eb8e414c744df05e1839703475ef8df66ad5c9d8192",
    x_api_key:"bT8aS3ezHOl6T1_PyaM30lkg7odC_42l" as string,
    indexer_fetch_endpoint:"https://aptos-testnet.nodit.io/bT8aS3ezHOl6T1_PyaM30lkg7odC_42l/v1/graphql" as string,
    aptos_network_setting: new AptosConfig({ network: Network.MAINNET}),
    function:{
        admin_like:()=>`${diffusion.module_address}::helper::admin_like` as `${string}::${string}::${string}`,
        create_bet_card:() =>`${diffusion.module_address}::helper::create_bet_card` as `${string}::${string}::${string}`,
        upload_result:() =>`${diffusion.module_address}::helper::upload_result` as `${string}::${string}::${string}`,
        reload:() =>`${diffusion.module_address}::helper::reload_single` as `${string}::${string}::${string}`,
        create_pair:() =>`${diffusion.module_address}::helper::create_pair` as `${string}::${string}::${string}`,
        admin_said_times_up:() =>`${diffusion.module_address}::helper::admin_said_times_up` as `${string}::${string}::${string}`,
        helper_upload_result:() =>`${diffusion.module_address}::helper::helper_upload_result` as `${string}::${string}::${string}`,
        set_chance :() =>`${diffusion.module_address}::helper::set_chance` as `${string}::${string}::${string}`,
        check_helper_list:() =>`${diffusion.module_address}::helper::check_helper_list` as `${string}::${string}::${string}`,
        create_account_tree :() => `${diffusion.module_address}::helper::create_account_tree` as `${string}::${string}::${string}`,
        diffusion_account_tree:() =>`${diffusion.module_address}::helper::Account_tree` as `${string}::${string}::${string}`,
        view_helper_upload_which_result:() =>`${diffusion.module_address}::helper::helper_upload_which_result` as `${string}::${string}::${string}`,
        diffusion_store_store: () => `${diffusion.module_address}::helper::Diffusion_store_tree` as `${string}::${string}::${string}`,
        create_helper:() => `${diffusion.module_address}::helper::create_helper` as `${string}::${string}::${string}`,
        apply_to_be_helper: () => `${diffusion.module_address}::helper::apply_to_be_helper` as `${string}::${string}::${string}`,
        claim_reward:() => `${diffusion.module_address}::helper::claim_reward` as `${string}::${string}::${string}`,
        user_view_badges : () => `${diffusion.module_address}::helper::return_badges` as `${string}::${string}::${string}`,
        turn_badges_to_nft : () => `${diffusion.module_address}::helper::turn_badges_to_nft` as `${string}::${string}::${string}`,
        turn_nft_to_badges :  () => `${diffusion.module_address}::helper::nft_burn_to_badges_v2` as `${string}::${string}::${string}`,
        return_mint_badges_list :  () => `${diffusion.module_address}::helper::check_badges_list` as `${string}::${string}::${string}`,
        check_is_white_list :  () => `${diffusion.module_address}::helper::check_address_whitelist` as `${string}::${string}::${string}`,
        mint_badges :  () => `${diffusion.module_address}::helper::mint_badges` as `${string}::${string}::${string}`,
        pontem_swap_v2 : () => `0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap` as `${string}::${string}::${string}`,
        pontem_router_swap_v2 : () => `0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::router::swap_exact_coin_for_coin_x1` as `${string}::${string}::${string}`,
        pontem_swap_curve_Uncorrelated : () => `0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated` as `${string}::${string}::${string}`,
        pontem_swap_curve_Uncorrelated_v2: () => `0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated` as `${string}::${string}::${string}`,
        pontem_router_view_pair_exists :() =>`0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::views::is_swap_exists` as `${string}::${string}::${string}`,
        pontem_router_get_amount_out :() =>`0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::views::get_amount_out` as `${string}::${string}::${string}`,
        pontem_router_BNstep :() =>`0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::router::BinStepV0V05` as `${string}::${string}::${string}`,
        thala_swap:()=>`0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool_scripts::swap_exact_in` as `${string}::${string}::${string}`
    },
    thala_type:{
        base_pool:"0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null",
        weight_50:"0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_50",
        }
    

}

