module pontem_address::liquidity_pool {
    use aptos_framework::coin::{Self, Coin};
    public fun swap<X, Y, Curve>(
        x_in: Coin<X>,
        x_out: u64,
        y_in: Coin<Y>,
        y_out: u64
    ){
    }

}