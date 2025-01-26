module all_or_nothing::limit {

    use aptos_framework::fungible_asset;
    use aptos_framework::fungible_asset::{FungibleAsset, Metadata};

    use aptos_framework::timestamp;

    friend all_or_nothing::liquidity;

    const Seed : vector<u8> = b"all or nothing";



    struct Limit_factor has key,store{
        min_decay_factor:u64,
        decay_duration:u64,
        price_threshold:u64
    }

    fun init_module(caller:&signer){
        move_to(caller , Limit_factor{
            min_decay_factor:2000,
            decay_duration:25923000,
            price_threshold:100000
        })
    }

    fun calculate_time_decay_factor(current_timestamp: u64, target_time: u64, decay_duration: u64, min_decay_factor: u64): u64{
        let time_elapsed =  if(target_time > current_timestamp){
            target_time - current_timestamp
        }else{
            0
        } ;
        if (current_timestamp >= target_time) {
            return min_decay_factor
        } else if (time_elapsed >= decay_duration) {
            // large than > 30 day
            return 10000
        }
        else {
            let result = ((10000-min_decay_factor) * time_elapsed / decay_duration);
            return result
        }
    }


    fun calculate_price_decay_factor(current_price:u64, init_price: u64, price_threshold: u64, min_decay_factor: u64): u64 {
        let price_diff =  if (current_price > init_price){
            current_price - init_price
        } else{
            return 10000
        };
        if (price_diff <= price_threshold) {
            return 10000
        }else if(price_diff >=100000){
            return min_decay_factor
        }else {
            let result = ((10000-min_decay_factor) * price_diff / (price_threshold*100));
            return result
        }
    }

    public(friend) fun calculate_final(
        in: FungibleAsset,
        user_price:u64,
        current_price:u64,
        init_price:u64,
        target_period:u64
    ):(FungibleAsset,FungibleAsset) acquires Limit_factor {
        let limit_factor = borrow_global<Limit_factor>(@all_or_nothing);
        let current_time_sap = timestamp::now_seconds();
        let time_decrease = calculate_time_decay_factor(current_time_sap,target_period,limit_factor.decay_duration,limit_factor.min_decay_factor);
        let price_decrease = if(user_price >= current_price){
            (10000 as u64)
        }else{
            calculate_price_decay_factor(current_price,init_price,limit_factor.price_threshold,limit_factor.min_decay_factor)
        };
        let finial_limt = time_decrease*price_decrease/10000000;
        let in_balacne = fungible_asset::amount(&in);
        let limit_fungible_assset = fungible_asset::extract(&mut in,in_balacne*finial_limt);
        return (in ,limit_fungible_assset)
    }
}
