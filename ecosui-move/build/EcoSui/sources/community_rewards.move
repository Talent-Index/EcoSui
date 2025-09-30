module ecosui::community_rewards {
    use sui::event;
    use sui::clock;

    /// Event to log community reward distributions expected by the frontend.
    public struct CommunityRewardDistributedEvent has copy, drop {
        community_id: u64,
        total_amount: u64,
        health_fund_allocation: u64,
        development_fund_allocation: u64,
        timestamp: u64,
    }

    /// Minimal function to align with frontend naming. Emits a distribution event.
    /// Splits `amount` using a fixed 60/40 ratio similar to frontend expectations.
    public fun distribute_rewards(
        community_id: u64,
        amount: u64,
        clk: &clock::Clock,
    ) {
        let health = (amount * 60) / 100; // 60%
        let dev = amount - health;        // 40%
        event::emit(CommunityRewardDistributedEvent {
            community_id,
            total_amount: amount,
            health_fund_allocation: health,
            development_fund_allocation: dev,
            timestamp: clock::timestamp_ms(clk),
        });
    }
}
