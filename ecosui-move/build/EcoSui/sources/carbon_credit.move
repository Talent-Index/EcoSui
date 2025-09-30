module ecosui::carbon_credit {
    use sui::event;
    use sui::clock;

    /// Thin wrapper module to provide the singular `carbon_credit` namespace
    /// expected by the frontend. It forwards to `ecosui::carbon_credits`.

    /// Re-export-like wrappers
    public fun register_oracle(
        admin_cap: &ecosui::carbon_credits::AdminCap,
        oracle_address: address,
        name: std::string::String,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        ecosui::carbon_credits::register_oracle(admin_cap, oracle_address, name, ctx)
    }

    public fun deactivate_oracle(
        admin_cap: &ecosui::carbon_credits::AdminCap,
        oracle: &mut ecosui::carbon_credits::Oracle,
    ) {
        ecosui::carbon_credits::deactivate_oracle(admin_cap, oracle)
    }

    public fun register_community(
        admin_cap: &ecosui::carbon_credits::AdminCap,
        community_id: u64,
        name: std::string::String,
        location: std::string::String,
        wallet_address: address,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        ecosui::carbon_credits::register_community(
            admin_cap,
            community_id,
            name,
            location,
            wallet_address,
            ctx,
        )
    }

    public fun mint_carbon_credit(
        oracle: &mut ecosui::carbon_credits::Oracle,
        community: &mut ecosui::carbon_credits::Community,
        pollution_type: u8,
        severity: u64,
        amount_kg: u64,
        location: std::string::String,
        metadata_url: std::string::String,
        clk: &clock::Clock,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        ecosui::carbon_credits::mint_carbon_credit(
            oracle,
            community,
            pollution_type,
            severity,
            amount_kg,
            location,
            metadata_url,
            clk,
            ctx,
        )
    }

    public fun deactivate_credit(
        credit: &mut ecosui::carbon_credits::CarbonCredit,
        oracle: &ecosui::carbon_credits::Oracle,
        clk: &clock::Clock,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        ecosui::carbon_credits::deactivate_credit(credit, oracle, clk, ctx)
    }

    // Convenience accessors forwarding
    public fun get_community_wallet(
        community: &ecosui::carbon_credits::Community,
    ): address {
        ecosui::carbon_credits::get_community_wallet(community)
    }

    public fun is_credit_active(
        credit: &ecosui::carbon_credits::CarbonCredit,
    ): bool {
        ecosui::carbon_credits::is_credit_active(credit)
    }
}
