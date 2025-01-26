module all_or_nothing::list {

    use std::error;
    use std::error::not_found;
    use std::option;
    use std::option::{Option, some, is_none};
    use std::signer::address_of;
    use std::string::{String, utf8};
    use std::vector;
    use aptos_std::debug;
    use aptos_std::smart_table;
    use aptos_std::smart_table::contains;
    use aptos_framework::event::emit;
    use aptos_framework::fungible_asset::Metadata;
    use aptos_framework::object::Object;
    use all_or_nothing::deploy_token;


    friend all_or_nothing::liquidity;
    friend all_or_nothing::limit;


    /// exist a user on list - left
    const E_exist_left_metadata:u64=1;
    /// exist a user on list - right
    const E_exist_right_metadata:u64=2;
    /// dont exists this metadata on this pool
    const E_not_exists_metadata:u64 =3;
    /// not exist a user on list - left
    const E_not_exist_left_metadata:u64=4;
    /// not exist a user on list - right
    const E_not_exist_right_metadata:u64=5;
    /// without this table_name
    const E_without_this_table :u64 =6;

    #[event]
    struct UpdateList has drop ,store{
        user:address,
        object:Object<Metadata>,
        update_price:u128,
        update_total:u128
    }

    struct Box has key,store,drop{
        total:u128,
        init_prize:u128
    }
    struct List has key,store {
        name:String,
        coin_metadata:Object<Metadata>,
        original_price:u64,
        table_init_prize:smart_table::SmartTable<address,Box>
    }
    struct Compare has key,store{
        coin_left:Option<List>,
        coin_right:Option<List>,
        preiod:String
    }
    struct All_data has key{
        all_table:smart_table::SmartTable<String,Compare>,
        all_string:vector<String>
    }

    #[view]
    public fun get_all_Compare():vector<String> acquires All_data {
        borrow_global<All_data>(@all_or_nothing).all_string
    }

    #[view]
    public fun get_address_data(table:String,user:address,way:u64):(u128,u128) acquires All_data {
        let borrow =borrow_global<All_data>(@all_or_nothing);
        let user_data =smart_table::borrow(&borrow.all_table,table);
        //debug::print(&utf8(b"compare"));
        //debug::print(user_data);

        if(way== 1){
            assert!(user_data.coin_right.borrow().table_init_prize.contains(user),not_found(1));
            let p=option::borrow(&user_data.coin_right);
            let a=smart_table::borrow(&p.table_init_prize,user);
            (a.init_prize,a.total)
        }else {
            assert!(user_data.coin_left.borrow().table_init_prize.contains(user),not_found(1));
            let p=option::borrow(&user_data.coin_left);
            let a=smart_table::borrow(&p.table_init_prize,user);
            (a.init_prize,a.total)
        }
    }

    #[view]
    public fun ask_period_compare(table_name:String):String acquires All_data {
        let all_data = borrow_global<All_data>(@all_or_nothing);
        assert!(smart_table::contains(&all_data.all_table,table_name) == true,error::not_implemented(E_without_this_table));
        let compare = smart_table::borrow(& all_data.all_table,table_name);
        compare.preiod
    }


    fun init_module(caller:&signer){
        move_to(caller, All_data{
            all_table:smart_table::new<String,Compare>(),
            all_string:vector::empty<String>()
        })
    }

    public fun create_list(left_name:String,right_name:String,metadata_left:Object<Metadata>,metadata_right:Object<Metadata>,period1:String,table_name:String,orignal_price1:u64) acquires All_data {
       // deploy_token::admin_authorize(caller);
        let put = Compare{
            coin_left:some(List{
                name:left_name,
                coin_metadata:metadata_left,
                original_price:orignal_price1,
                table_init_prize:smart_table::new<address,Box>()
            }),
            coin_right:some(List{
                name:right_name,
                coin_metadata:metadata_right,
                original_price:orignal_price1,
                table_init_prize:smart_table::new<address,Box>()
            }),
            preiod:period1
        };
        smart_table::add(  &mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name,put);
    }

    public fun ask_person(person:address,coin:Object<Metadata>,table_name:String):(Option<u128>,Option<u128>) acquires All_data {
        let all_or_nothing = smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name);
        let way =find_list(all_or_nothing,coin);
        assert!(way != 0 ,error::not_implemented(E_not_exists_metadata));

        if(smart_table::contains(&option::borrow(&all_or_nothing.coin_left).table_init_prize,person)){
            if(way == 1){
                //assert!(smart_table::contains(&option::borrow(&all_or_nothing.coin_left).table_init_prize,person),1);
                let a =smart_table::borrow(&option::borrow(&all_or_nothing.coin_left).table_init_prize,person);
                return (option::some(a.total),option::some(a.init_prize))
            }else{
                //assert!(smart_table::contains(&option::borrow(&all_or_nothing.coin_right).table_init_prize,person),1);
                let a =smart_table::borrow(&option::borrow(&all_or_nothing.coin_right).table_init_prize,person);
                return (option::some(a.total),option::some(a.init_prize))
            }
        }else{
            return (option::none<u128>(),option::none<u128>())
        }

    }

    fun find_list(targert:&mut Compare,coin:Object<Metadata>):u8{
        // find which list of this metadata
        if(option::borrow(&targert.coin_left).coin_metadata == coin){
            return 1
        }else if(option::borrow(&targert.coin_right).coin_metadata == coin){
           return 2
        }else{
            return 0
        }
    }

    #[test_only]
    public fun call_list_init(caller:&signer){
        init_module(caller);
    }
    #[test_only]
    public fun add_Compare(left_name:String,right_name:String,metadata_left:Object<Metadata>,metadata_right:Object<Metadata>,period1:String,table_name:String,orignal_price1:u64) acquires All_data {
        let put = Compare{
            coin_left:some(List{
                name:left_name,
                coin_metadata:metadata_left,
                original_price:orignal_price1,
                table_init_prize:smart_table::new<address,Box>()
            }),
            coin_right:some(List{
                name:right_name,
                coin_metadata:metadata_right,
                original_price:orignal_price1,
                table_init_prize:smart_table::new<address,Box>()
            }),
            preiod:period1
        };
        smart_table::add( &mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name,put);
        vector::push_back(&mut borrow_global_mut<All_data>(@all_or_nothing).all_string,table_name);
    }
    #[test_only]
    public fun add_person(metadata:Object<Metadata>,person:address,box_total:u128,box_init:u128,table_name:String) acquires All_data {
        let all_or_nothing = smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name);
        let way =find_list(all_or_nothing,metadata);
        if(way == 1){
           smart_table::add(&mut option::borrow_mut(&mut all_or_nothing.coin_left).table_init_prize,person,Box{total:box_total,init_prize:box_init});
        }else{
            smart_table::add(&mut option::borrow_mut(&mut all_or_nothing.coin_right).table_init_prize,person,Box{total:box_total,init_prize:box_init});
        }
    }

    public(friend)fun swap_entry(caller:&signer,amount:u64,init_prize1:u64,table_name:String,metadata:Object<Metadata>,buy_or_sell:String,price:u64) acquires All_data {
        // when user use swap this table will record the first time trade init prize and amount ,
        // box -> table according address
        let way = find_list( smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name),metadata);
        let (person_total , person_init)=ask_person(address_of(caller),metadata,table_name);
        assert!(way !=0 , error::not_implemented(E_not_exists_metadata));
       // debug::print(&way);
        let right =(!(option::is_none(&person_total) && option::is_none(&person_init)));
       // debug::print(&right);
        if(right){
            //with user data
            let (user_total,user_init)={
                (option::borrow_mut(&mut person_total) , option::borrow_mut(&mut person_init))
            };

            if(way == 1){
                // left object metadata
                assert!(smart_table::contains(&option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_left).table_init_prize,address_of(caller)) == true,error::not_implemented(E_not_exist_left_metadata));
                judge_buy_or_sell(caller,buy_or_sell,metadata,table_name,amount,price);
            }else if(way ==2){
                // right metadata
                assert!(smart_table::contains(&option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_right).table_init_prize,address_of(caller)) == true,error::not_implemented(E_not_exist_right_metadata));
                judge_buy_or_sell(caller,buy_or_sell,metadata,table_name,amount,price);
            }else{

            }
        }else{
            let person_box = Box{
                total: (amount as u128),
                init_prize: (init_prize1 as u128),
            };
            // without data of user
            if(way == 1){
                // left object metadata
                assert!(smart_table::contains(&option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_left).table_init_prize,address_of(caller)) == false,error::not_implemented(E_exist_left_metadata));
                smart_table::add(&mut option::borrow_mut(&mut smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name).coin_left).table_init_prize,address_of(caller),person_box);
            }else if(way ==2){
                // right metadata
                assert!(smart_table::contains(&option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_right).table_init_prize,address_of(caller)) == false,error::not_implemented(E_exist_right_metadata));
                smart_table::add(&mut option::borrow_mut(&mut smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name).coin_right).table_init_prize,address_of(caller),person_box);
            }else{

            }
        }

    }
    inline fun judge_buy_or_sell(caller:&signer,buy_or_sell:String,metadata:Object<Metadata>,table_name:String,amount:u64,price:u64) acquires All_data {
        if(buy_or_sell == utf8(b"buy")){
            let (now_box_total,now_box_price) =buy_action(caller,table_name,metadata,amount,price);

            if(!(is_none(&now_box_price) && is_none(&now_box_total))){
                emit(UpdateList{
                    user:address_of(caller),
                    object:metadata,
                    update_price:*option::borrow(&now_box_price),
                    update_total:*option::borrow(&now_box_total)
                })
            };

        }else if(buy_or_sell == utf8(b"sell")){
            let (now_box_total,now_box_price) = sell_action(caller,table_name,metadata,amount);
            if(!(is_none(&now_box_price) && is_none(&now_box_total))){
                emit(UpdateList{
                    user:address_of(caller),
                    object:metadata,
                    update_price:*option::borrow(&now_box_price),
                    update_total:*option::borrow(&now_box_total)
                })
            }
        };
    }
    // public(friend) fun swap_with_data(caller:&signer,buy_or_sell:String,metadata:Object<Metadata>,table_name:String,amount:u64,price:u64):(u128,u128) acquires All_data {
    //     //when user not the first time swap, we will have record on ours table ,
    //     //then we will read those data to find his -> init prize and amount,
    //     //if he sell , his box amount will decrease ,init prise dont change  -> prize == , amount -
    //     //if he buy , his box amount will increase , init prise increas -> prize + , amount +
    //     if(buy_or_sell == utf8(b"buy")){
    //        let (now_box_total,now_box_price) =buy_action(caller,table_name,metadata,amount,price);
    //         return (now_box_total,now_box_price)
    //     }else if(buy_or_sell == utf8(b"sell")){
    //         let (now_box_total,now_box_price) = sell_action(caller,table_name,metadata,amount);
    //         return (now_box_total,now_box_price)
    //     };
    //     return (000,000)
    // }


    fun buy_action(caller:&signer,table_name:String,metadata:Object<Metadata>,amount:u64,price_now:u64):(Option<u128>,Option<u128>) acquires All_data {
        let way = find_list( smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name),metadata);
        let (box_total,box_init)=ask_person(address_of(caller),metadata,table_name);
        assert!(!option::is_none(&box_total) && !option::is_none(&box_init) , 2);
        let (new_total,new_init_price) = cal_average_price_buy(*option::borrow(&box_total),*option::borrow(&box_init),amount,price_now);
        if(way == 1){
            assert!(smart_table::contains(&option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_left).table_init_prize,address_of(caller)),1);
            let specfic_box = smart_table::borrow_mut(&mut option::borrow_mut(&mut smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name).coin_left).table_init_prize,address_of(caller));
            specfic_box.total = new_total;
            specfic_box.init_prize = new_init_price;

            return (some(specfic_box.total),some(specfic_box.init_prize))
        }else{
            assert!(smart_table::contains(&option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_right).table_init_prize,address_of(caller)),1);
            let specfic_box = smart_table::borrow_mut(&mut option::borrow_mut(&mut smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name).coin_right).table_init_prize,address_of(caller));
            specfic_box.total = new_total;
            specfic_box.init_prize = new_init_price;
            return (some(specfic_box.total),some(specfic_box.init_prize))
        };
        return (option::none(),option::none())
    }

    fun sell_action(caller:&signer,table_name:String,metadata:Object<Metadata>,amount:u64):(Option<u128>,Option<u128>) acquires All_data {
        let way = find_list( smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name),metadata);
        let (box_total,box_init)=ask_person(address_of(caller),metadata,table_name);
        assert!(!option::is_none(&box_total) && !option::is_none(&box_init) , 2);
        let total_amount = cal_average_price_sell(*option::borrow(&box_total),amount);
        if(way == 1){
            assert!(smart_table::contains(&option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_left).table_init_prize,address_of(caller)),1);
            let specfic_box = smart_table::borrow_mut(&mut option::borrow_mut(&mut smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name).coin_left).table_init_prize,address_of(caller));
            specfic_box.total = total_amount;

            return (some(specfic_box.total),some(specfic_box.init_prize))
        }else{
            assert!(smart_table::contains(&option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_right).table_init_prize,address_of(caller)),1);
            let specfic_box = smart_table::borrow_mut(&mut option::borrow_mut(&mut smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name).coin_right).table_init_prize,address_of(caller));
            specfic_box.total = total_amount;

            return (some(specfic_box.total),some(specfic_box.init_prize))
        };
        return (option::none(),option::none())
    }

    public fun cal_average_price_buy(old_amount:u128,old_init_price:u128,now_amount:u64,now_price:u64):(u128,u128){
        let total = old_init_price*old_amount + (now_amount*now_price as u128);
        let total_amount = (now_amount as u128) + old_amount;

        return (total_amount,total/total_amount)
    }
    fun cal_average_price_sell(old_amount:u128,now_amount:u64):u128{
        let total_amount = old_amount - (now_amount as u128);
        return total_amount
    }


    public(friend) fun ask_orginal_price(table_name:String,metadata:Object<Metadata>):u64 acquires All_data {
        let way = find_list( smart_table::borrow_mut(&mut borrow_global_mut<All_data>(@all_or_nothing).all_table,table_name),metadata);
        assert!(way !=0 ,error::not_implemented(E_not_exists_metadata));
        if(way == 1 ){
            return option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_left).original_price
        }else{
            return option::borrow(&smart_table::borrow(&borrow_global<All_data>(@all_or_nothing).all_table,table_name).coin_right).original_price
        }
    }


    public fun ask_buy_or_sell(x_metadata:Object<Metadata>,y_metadata:Object<Metadata>,table_name:String):String acquires All_data {
        let all = borrow_global<All_data>(@all_or_nothing);
        assert!(contains(&all.all_table,table_name)== true, error::not_implemented(E_without_this_table));
        let compare = smart_table::borrow(&all.all_table,table_name);
        let return_value = if(x_metadata == option::borrow(&compare.coin_left).coin_metadata && y_metadata != option::borrow(&compare.coin_right).coin_metadata){
             (utf8(b"buy"))
        }else if (x_metadata == option::borrow(&compare.coin_right).coin_metadata && y_metadata != option::borrow(&compare.coin_left).coin_metadata){
           (utf8(b"buy"))
        }else{
             (utf8(b"sell"))
        };
        return_value
    }
}
