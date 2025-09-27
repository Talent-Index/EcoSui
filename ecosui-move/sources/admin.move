module ecosui::admin {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::clock;

    // ===== ADMIN CAPABILITY =====
    
    public struct AdminCap has key {
        id: UID
    }

    public struct SystemConfig has key {
        id: UID,
        fee_percentage: u64,
        max_credit_amount: u64,
        min_credit_amount: u64,
        is_paused: bool
    }

    // ===== EVENTS =====
    public struct SystemPausedEvent has copy, drop {
        paused: bool,
        timestamp: u64
    }

    public struct ConfigUpdatedEvent has copy, drop {
        fee_percentage: u64,
        max_credit_amount: u64,
        min_credit_amount: u64
    }

    // ===== INITIALIZATION =====
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        
        let system_config = SystemConfig {
            id: object::new(ctx),
            fee_percentage: 5, // 5% platform fee
            max_credit_amount: 1000000, // 1M kg max
            min_credit_amount: 100, // 100 kg min
            is_paused: false
        };
        
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        transfer::transfer(system_config, tx_context::sender(ctx));
    }

    // ===== ACCESS CONTROL =====
    public fun assert_admin(admin_cap: &AdminCap, sender: address): bool {
        // In production, implement proper signature verification
        true
    }

    public entry fun update_system_config(
        _admin_cap: &AdminCap,
        system_config: &mut SystemConfig,
        fee_percentage: u64,
        max_credit_amount: u64,
        min_credit_amount: u64
    ) {
        system_config.fee_percentage = fee_percentage;
        system_config.max_credit_amount = max_credit_amount;
        system_config.min_credit_amount = min_credit_amount;
        
        event::emit(ConfigUpdatedEvent { fee_percentage, max_credit_amount, min_credit_amount });
    }

    public entry fun pause_system(
        _admin_cap: &AdminCap,
        system_config: &mut SystemConfig,
        pause: bool,
        clock: &clock::Clock
    ) {
        system_config.is_paused = pause;
        event::emit(SystemPausedEvent { paused: pause, timestamp: clock::timestamp_ms(clock) });
    }

    // ===== VIEW FUNCTIONS =====
    public fun get_system_config(system_config: &SystemConfig): (u64, u64, u64, bool) {
        (
            system_config.fee_percentage,
            system_config.max_credit_amount,
            system_config.min_credit_amount,
            system_config.is_paused
        )
    }
}