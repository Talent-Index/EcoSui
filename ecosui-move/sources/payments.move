module ecosui::payments {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    
    
    use sui::event;
    
    use sui::clock;
    use sui::object::{Self as object, UID};
    use sui::transfer::{Self as transfer};
    use sui::tx_context::{Self as tx_context, TxContext};

    // ===== STRUCTURES =====
    
    public struct Treasury has key {
        id: UID,
        total_revenue: u64,
        community_funds: u64,
        platform_funds: u64
    }

    public struct PlatformTreasury has key {
        id: UID,
        total_funds: u64
    }

    public struct PaymentDistributionEvent has copy, drop {
        amount: u64,
        community_share: u64,
        platform_share: u64,
        community_address: address,
        timestamp: u64
    }

    public struct WithdrawalEvent has copy, drop {
        recipient: address,
        amount: u64,
        timestamp: u64
    }

    // ===== CONSTANTS =====
    const COMMUNITY_SHARE_PERCENT: u64 = 60;
    const PLATFORM_SHARE_PERCENT: u64 = 40;
    const ERROR_INSUFFICIENT_FUNDS: u64 = 200;
    const ERROR_UNAUTHORIZED: u64 = 201;

    // ===== INITIALIZATION =====
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            total_revenue: 0,
            community_funds: 0,
            platform_funds: 0
        };
        
        let platform_treasury = PlatformTreasury {
            id: object::new(ctx),
            total_funds: 0
        };
        
        transfer::transfer(treasury, tx_context::sender(ctx));
        transfer::transfer(platform_treasury, tx_context::sender(ctx));
    }

    // ===== PAYMENT DISTRIBUTION =====
    
    public fun distribute_payment(
        payment: &mut Coin<SUI>,
        amount: u64,
        community_address: address,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(payment) >= amount, ERROR_INSUFFICIENT_FUNDS);
        
        let community_share = (amount * COMMUNITY_SHARE_PERCENT) / 100;
        let platform_share = amount - community_share;

        // Split community share and transfer
        let community_payment = coin::split(payment, community_share, ctx);
        transfer::public_transfer(community_payment, community_address);

        // Platform share remains in the payment for further processing
        
        event::emit(PaymentDistributionEvent {
            amount,
            community_share,
            platform_share,
            community_address,
            timestamp: clock::timestamp_ms(clock)
        });
    }

    public fun process_platform_payment(
        treasury: &mut Treasury,
        platform_treasury: &mut PlatformTreasury,
        platform_payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&platform_payment);
        
        treasury.total_revenue = treasury.total_revenue + amount;
        treasury.platform_funds = treasury.platform_funds + amount;
        platform_treasury.total_funds = platform_treasury.total_funds + amount;
        
        // Store or process platform funds
        transfer::public_transfer(platform_payment, tx_context::sender(ctx));
    }

    // ===== TREASURY MANAGEMENT =====
    
    public fun withdraw_platform_funds(
        platform_treasury: &mut PlatformTreasury,
        treasury: &mut Treasury,
        amount: u64,
        recipient: address,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        assert!(platform_treasury.total_funds >= amount, ERROR_INSUFFICIENT_FUNDS);
        assert!(tx_context::sender(ctx) == recipient, ERROR_UNAUTHORIZED);
        
        platform_treasury.total_funds = platform_treasury.total_funds - amount;
        treasury.platform_funds = treasury.platform_funds - amount;
        
        event::emit(WithdrawalEvent {
            recipient,
            amount,
            timestamp: clock::timestamp_ms(clock)
        });
    }

    // ===== VIEW FUNCTIONS =====
    
    public fun get_treasury_stats(treasury: &Treasury): (u64, u64, u64) {
        (treasury.total_revenue, treasury.community_funds, treasury.platform_funds)
    }

    public fun get_platform_stats(platform_treasury: &PlatformTreasury): u64 {
        platform_treasury.total_funds
    }

    #[test_only]
    public fun create_test_treasury(ctx: &mut TxContext): (Treasury, PlatformTreasury) {
        let treasury = Treasury {
            id: object::new(ctx),
            total_revenue: 0,
            community_funds: 0,
            platform_funds: 0
        };
        
        let platform_treasury = PlatformTreasury {
            id: object::new(ctx),
            total_funds: 0
        };
        
        (treasury, platform_treasury)
    }
}