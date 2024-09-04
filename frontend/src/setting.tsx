export const  diffusion = {
    module_address:"0x7776f4ac2f3a13f751b966220b0e68e0b5688682c31e4f93cbf12ce1cea4a7b9",
    resources_address:"0x8e1610bc1fe8556c7e839f6afc1d420db7fa50fd7251adfb0e11aeb8516bae77",
    garble_address:"0x987876fa678f2f8097b57b2b7a2d9689144455052802e1ab46b4363d12768115",
    Bank_address:"0xf711fef606b3114ee9d6f718d8c6a209eccc362dc8b1af31372d4c73a833e5be",
    Helper_address:"0x5ec0ff7e30c95dc7f6610eb8e414c744df05e1839703475ef8df66ad5c9d8192",
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
    }

}

