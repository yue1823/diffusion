module all_or_nothing::debug{

    #[test_only]
    use std::string::utf8;
    #[test_only]
    use aptos_std::debug;
    #[test_only]
    use aptos_std::string_utils;
    #[test_only]
    use aptos_std::string_utils::debug_string;

    #[test_only]
    public fun eq_drop<T:drop>(expect:T, actual:T, err:u64){
        if(&expect != &actual){
            let message = utf8(b"Assertion failed:");
            message.append(utf8(b"\n Expected:"));
            message.append(debug_string(&expect));
            message.append(utf8(b"\n Got"));
            message.append(debug_string(&actual));
            debug::print(&message);
            abort err
        }
    }

    #[test_only]
    ///return expect and actual ,doesnt required drop
    public fun eq_without_drop<T:drop>(expect:T,actual:T,err:u64):(T,T){
        if(&expect != &actual){
            debug::print(&string_utils::format2(&b"Assertion failed :\n Expected: {} = {}",expect,actual));
            abort err
        }else{
            return (expect,actual)
        }
    }


}
