#[test_only]
module ecosui::test_ecosui {
    use sui::test_scenario;
    use sui::tx_context;
    use std::string;
    use sui::clock;
    use ecosui::carbon_credits;
    use ecosui::marketplace;
    use ecosui::payments;
    use ecosui::governance;
    use ecosui::admin;
    use sui::object::{ID, UID};

    #[test]
    fun test_end_to_end_flow() {
        let scenario_val = test_scenario::begin(@0x123);
        let admin = test_scenario::next_tx(&mut scenario_val, @0x123);
        
        // Initialize all modules
        let admin_cap = carbon_credits::init(&mut scenario_val);
        marketplace::init(&mut scenario_val);
        payments::init(&mut scenario_val);
        admin::init(&mut scenario_val);
        
        // Register oracle
        carbon_credits::register_oracle(
            &admin_cap,
            @0xOracle,
            string::utf8(b"Kibera Oracle"),
            &mut scenario_val
        );
        
        // Register community
        carbon_credits::register_community(
            &admin_cap,
            1,
            string::utf8(b"Kibera Community"),
            string::utf8(b"Nairobi, Kenya"),
            @0xCommunity,
            &mut scenario_val
        );
        
        test_scenario::next_tx(&mut scenario_val, @0xOracle);
        
        // Create test objects
        let community = carbon_credits::create_test_community(1, @0xCommunity, &mut scenario_val);
        let oracle = carbon_credits::create_test_oracle(@0xOracle, &mut scenario_val);
        
        // Mint carbon credit
        carbon_credits::mint_carbon_credit(
            &mut oracle,
            &mut community,
            0, // air pollution
            75, // severity
            1000, // 1000 kg
            string::utf8(b"Kibera, Nairobi"),
            string::utf8(b"https://ecosui.com/metadata/1"),
            &mut scenario_val
        );
        
        test_scenario::end(scenario_val);
    }

    #[test] 
    fun test_marketplace_flow() {
        let scenario_val = test_scenario::begin(@0xSeller);
        let seller = test_scenario::next_tx(&mut scenario_val, @0xSeller);
        
        marketplace::init(&mut scenario_val);
        
        let marketplace_obj = marketplace::create_test_marketplace(&mut scenario_val);
        let credit = carbon_credits::create_test_credit(1, 1000, @0xSeller, &mut scenario_val);
        
        marketplace::create_listing(
            &mut marketplace_obj,
            &credit,
            1000,
            &mut scenario_val
        );
        
        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_governance_flow() {
        let scenario_val = test_scenario::begin(@0xCommunity);
        let community_addr = test_scenario::next_tx(&mut scenario_val, @0xCommunity);
        
        let governance = governance::create_test_governance(1, &mut scenario_val);
        
        governance::create_proposal(
            &mut governance,
            string::utf8(b"Build Health Clinic"),
            string::utf8(b"Use funds to build a health clinic in Kibera"),
            50000,
            7, // 7 days voting
            &mut scenario_val
        );
        
        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_payment_distribution() {
        let scenario_val = test_scenario::begin(@0xTreasury);
        let treasury_addr = test_scenario::next_tx(&mut scenario_val, @0xTreasury);
        
        payments::init(&mut scenario_val);
        
        // Test payment distribution logic
        let (treasury, platform_treasury) = payments::create_test_treasury(&mut scenario_val);
        
        test_scenario::end(scenario_val);
    }
}