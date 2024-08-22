export const  diffusion = {
    module_address:"0xd3d2a6b4340d87ea390368ddcab692cf4b330c86fb5daaa2609e1052c20ca873",
    resources_address:"0xbe47168a83a2ed7114a689e02a7a1cacc04c19fd9f056e9dbf7c921175d05da8",
    garble_address:"",
    Bank_address:"",
    Helper_address:"",
    Account_tree:":",
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
    }

}

