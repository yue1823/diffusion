module all_or_nothing::account {

    use std::error;
    use std::error::not_implemented;
    use std::signer::address_of;
    use std::string::String;
    use std::vector;
    use std::vector::find;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use all_or_nothing::package_manager;
    use all_or_nothing::whitelist::Badges;

    friend all_or_nothing::stake;

    ///Not admin
    const E_not_admin:u64 =1 ;
    ///not exists
    const E_not_exists_user:u64 =2;
    ///already exists
    const E_exists_badges:u64 =3;
    /// Over voting power
    const E_over_voting_power :u64 =4;
    /// OVER TOTAL BOTING BALANCE
    const E_over_total_blance:u64 = 5;
    /// Without stake data
    const E_without_stake_data :u64 =6;

    struct Stake_data has key ,store,drop{
        data:u128,
        balance:u128
    }

    struct Voter_power has key ,store{
        balance:u128,
        active:u128,
        frozen:u128,
        stake:vector<Stake_data>
    }

    struct User has key,store{
        name:String,
        profit:u64,
        point:u64,
        cap_badges:vector<Badges>,
        voting_power:Voter_power
    }

    struct Account_tree has key,store{
        data:SmartTable<address,User>
    }


    #[view]
    public fun ask_user(target:address):User acquires Account_tree {
        let borrow = borrow_global<Account_tree>(address_of(&package_manager::get_signer()));
        assert!(smart_table::contains(&borrow.data,target)== true , error::not_implemented( E_not_exists_user));
        let speccfid = smart_table::borrow(&borrow.data,target);
        User{
            name:speccfid.name,
            profit:speccfid.profit,
            point:speccfid.point,
            cap_badges:speccfid.cap_badges,
            voting_power:Voter_power{
                balance:speccfid.voting_power.balance,
                active:speccfid.voting_power.active,
                frozen:speccfid.voting_power.frozen,
                stake:vector::empty<Stake_data>()
            }
        }
    }


    public entry fun init_for_account (caller:&signer){
        assert!(address_of(caller) == @admin || address_of(caller) == @admin1,error::not_implemented(E_not_admin));
        let onj_signer = &package_manager::get_signer();
        move_to(onj_signer,Account_tree{
            data:smart_table::new<address,User>()
        })
    }

    public(friend) fun mint_action(caller:&signer,badges:Badges) acquires Account_tree {
        let borrow = borrow_global_mut<Account_tree>(address_of(&package_manager::get_signer()));
        assert!(smart_table::contains(&borrow.data,address_of(caller))== true , error::not_implemented( E_not_exists_user));
        let a =smart_table::borrow_mut(&mut borrow.data,address_of(caller));
        let (yes,index)=find(& a.cap_badges,|target|same_badges(target,&badges));
        if(yes){
            assert!(yes ==true,error::not_implemented(E_exists_badges));
        }else{
            vector::push_back(&mut a.cap_badges,badges);
        }
    }

    fun same_badges(target:&Badges,s:&Badges):bool{
        target == s
    }
    inline fun borrow_user(caller:&signer):&mut User{
        let borrow = borrow_global_mut<Account_tree>(address_of(&package_manager::get_signer()));
        assert!(smart_table::contains(&borrow.data,address_of(caller))== true , error::not_implemented( E_not_exists_user));
        let user = smart_table::borrow_mut(&mut borrow.data,address_of(caller));
        user
    }

    public(friend) fun add_vote_power(caller:&signer,balance:u128,date_data:u128) acquires Account_tree {
        let user = borrow_user(caller);
        user.voting_power.balance = user.voting_power.balance + balance;
        user.voting_power.active = user.voting_power.active + balance;
        let new_stake = Stake_data{
            data:date_data,
            balance:balance
        };
        user.voting_power.stake.push_back(new_stake);
    }

    public(friend) fun add_fozen_vote_power(caller:&signer,fozen_balance:u128) acquires Account_tree {
        let user = borrow_user(caller);
        assert!((user.voting_power.frozen + fozen_balance) <= user.voting_power.balance,error::not_implemented(E_over_voting_power));
        user.voting_power.frozen = user.voting_power.frozen + fozen_balance ;
        user.voting_power.active = user.voting_power.active - fozen_balance ;
        assert!(user.voting_power.frozen + user.voting_power.active == user.voting_power.balance ,error::not_implemented(E_over_total_blance));
    }

    public(friend) fun add_active_vote_power(caller:&signer,active_balance:u128) acquires Account_tree {
        let user = borrow_user(caller);
        assert!((user.voting_power.active + active_balance) <= user.voting_power.balance,error::not_implemented(E_over_voting_power));
        user.voting_power.active = user.voting_power.active + active_balance;
        assert!(user.voting_power.frozen + user.voting_power.active == user.voting_power.balance ,error::not_implemented(E_over_total_blance));
    }

    public(friend) fun minus_voting_balance(caller:&signer,minus_balance:u128) acquires Account_tree {
        let user = borrow_user(caller);
        assert!((user.voting_power.balance >= minus_balance) && (user.voting_power.active >= minus_balance),error::not_implemented(E_over_total_blance));
        user.voting_power.balance = user.voting_power.balance - minus_balance;
        user.voting_power.active = user.voting_power.active - minus_balance;

    }
    #[view]
    public fun get_vote_power(user:address):(u128,u128,u128) acquires Account_tree {
        let borrow = borrow_global<Account_tree>(address_of(&package_manager::get_signer()));
        assert!(smart_table::contains(&borrow.data,user)== true , error::not_implemented( E_not_exists_user));
        let speccfid = smart_table::borrow(&borrow.data,user);
        (speccfid.voting_power.balance,speccfid.voting_power.active,speccfid.voting_power.frozen)
    }

    public(friend) fun checek_stake_data(user:address,balance:u128,period:u128) acquires Account_tree {
        let borrow = borrow_global_mut<Account_tree>(address_of(&package_manager::get_signer()));
        assert!(smart_table::contains(&borrow.data,user)== true , error::not_implemented( E_not_exists_user));
        let speccfid = smart_table::borrow_mut(&mut borrow.data,user);
        let (right,index)=find(&speccfid.voting_power.stake,|t| a(t,period,balance));
        assert!(right != true,not_implemented(E_without_stake_data));
        vector::remove(&mut speccfid.voting_power.stake,index);
    }

    fun a(target:&Stake_data,p:u128,b:u128):bool{
        (target.data == p ) && (target.balance == b)
    }
}
