module ecosui::carbon_credits {
    
    
    
    use sui::event;
    use std::string::String;
    use sui::clock;
    use sui::object::{Self as object, UID, ID};
    use sui::transfer::{Self as transfer};
    use sui::tx_context::{Self as tx_context, TxContext};

    // ===== STRUCTURES =====
    
    public struct CarbonCredit has key, store {
        id: UID,
        community_id: u64,
        pollution_type: u8, // 0=air, 1=water, 2=land
        severity: u64,      // pollution level
        amount_kg: u64,     // carbon equivalent in kg
        timestamp: u64,
        location: String,
        verified_by: address,
        metadata_url: String,
        is_active: bool
    }

    public struct Community has key {
        id: UID,
        community_id: u64,
        name: String,
        location: String,
        wallet_address: address,
        total_credits_minted: u64,
        total_revenue: u64
    }

    public struct Oracle has key {
        id: UID,
        oracle_address: address,
        is_active: bool,
        name: String
    }

    public struct AdminCap has key {
        id: UID
    }

    public struct CreditMintEvent has copy, drop {
        credit_id: ID,
        community_id: u64,
        amount_kg: u64,
        timestamp: u64,
        oracle: address
    }

    public struct OracleRegisteredEvent has copy, drop {
        oracle_address: address,
        name: String
    }

    public struct CommunityRegisteredEvent has copy, drop {
        community_id: u64,
        name: String,
        wallet_address: address
    }

    public struct CreditDeactivatedEvent has copy, drop {
        credit_id: ID,
        deactivated_by: address,
        timestamp: u64
    }

    // ===== CONSTANTS =====
    
    const _ERROR_NOT_ORACLE: u64 = 1;
    const _ERROR_INVALID_COMMUNITY: u64 = 2;
    const ERROR_CREDIT_INACTIVE: u64 = 3;
    const ERROR_UNAUTHORIZED: u64 = 4;
    const ERROR_ORACLE_INACTIVE: u64 = 5;

    // ===== INITIALIZATION =====
    
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    // ===== ORACLE MANAGEMENT =====
    
    public fun register_oracle(
        _admin_cap: &AdminCap,
        oracle_address: address,
        name: String,
        ctx: &mut TxContext
    ) {
        let oracle = Oracle {
            id: object::new(ctx),
            oracle_address: oracle_address,
            is_active: true,
            name: name
        };
        transfer::transfer(oracle, oracle_address);
        event::emit(OracleRegisteredEvent {
            oracle_address,
            name
        });
    }

    public fun deactivate_oracle(
        _admin_cap: &AdminCap,
        oracle: &mut Oracle
    ) {
        oracle.is_active = false;
    }

    // ===== COMMUNITY REGISTRATION =====
    
    public fun register_community(
        _admin_cap: &AdminCap,
        community_id: u64,
        name: String,
        location: String,
        wallet_address: address,
        ctx: &mut TxContext
    ) {
        let community = Community {
            id: object::new(ctx),
            community_id: community_id,
            name: name,
            location: location,
            wallet_address: wallet_address,
            total_credits_minted: 0,
            total_revenue: 0
        };
        transfer::transfer(community, wallet_address);
        event::emit(CommunityRegisteredEvent {
            community_id,
            name,
            wallet_address
        });
    }

    // ===== CORE MINTING FUNCTION =====
    
    public fun mint_carbon_credit(
        oracle: &mut Oracle,
        community: &mut Community,
        pollution_type: u8,
        severity: u64,
        amount_kg: u64,
        location: String,
        metadata_url: String,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        assert!(oracle.is_active, ERROR_ORACLE_INACTIVE);
        assert!(oracle.oracle_address == tx_context::sender(ctx), ERROR_UNAUTHORIZED);

        let timestamp = clock::timestamp_ms(clock);
        
        let credit_uid = object::new(ctx);
        let credit_id = object::uid_to_inner(&credit_uid);
        let credit = CarbonCredit {
            id: credit_uid,
            community_id: community.community_id,
            pollution_type: pollution_type,
            severity: severity,
            amount_kg: amount_kg,
            timestamp: timestamp,
            location: location,
            verified_by: oracle.oracle_address,
            metadata_url: metadata_url,
            is_active: true
        };

        // Update community stats
        community.total_credits_minted = community.total_credits_minted + amount_kg;

        // Emit event
        event::emit(CreditMintEvent {
            credit_id,
            community_id: community.community_id,
            amount_kg: amount_kg,
            timestamp: timestamp,
            oracle: oracle.oracle_address
        });

        transfer::transfer(credit, community.wallet_address);
    }

    // ===== CREDIT MANAGEMENT =====
    
    public fun deactivate_credit(
        credit: &mut CarbonCredit,
        oracle: &Oracle,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        assert!(oracle.is_active, ERROR_ORACLE_INACTIVE);
        assert!(oracle.oracle_address == tx_context::sender(ctx), ERROR_UNAUTHORIZED);
        credit.is_active = false;
        
        event::emit(CreditDeactivatedEvent {
            credit_id: object::uid_to_inner(&credit.id),
            deactivated_by: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock)
        });
    }

    // ===== VIEW FUNCTIONS =====
    
    public fun get_credit_details(credit: &CarbonCredit): (
        u64, u8, u64, u64, u64, &String, address, &String, bool
    ) {
        (
            credit.community_id,
            credit.pollution_type,
            credit.severity,
            credit.amount_kg,
            credit.timestamp,
            &credit.location,
            credit.verified_by,
            &credit.metadata_url,
            credit.is_active
        )
    }

    public fun get_community_stats(community: &Community): (u64, u64, u64, &String) {
        (
            community.community_id,
            community.total_credits_minted,
            community.total_revenue,
            &community.name
        )
    }

    // ===== ACCESSOR FUNCTIONS =====
    
    public fun is_credit_active(credit: &CarbonCredit): bool {
        credit.is_active
    }

    public fun get_community_wallet(community: &Community): address {
        community.wallet_address
    }

    public fun update_community_revenue(community: &mut Community, amount: u64) {
        community.total_revenue = community.total_revenue + amount;
    }

    // ===== TEST-ONLY FUNCTIONS =====
    #[test_only]
    public fun create_test_credit(
        community_id: u64,
        amount_kg: u64,
        creator: address,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ): CarbonCredit {
        CarbonCredit {
            id: object::new(ctx),
            community_id: community_id,
            pollution_type: 0,
            severity: 50,
            amount_kg: amount_kg,
            timestamp: clock::timestamp_ms(clock),
            location: std::string::utf8(b"Test Location"),
            verified_by: creator,
            metadata_url: std::string::utf8(b"https://example.com/metadata"),
            is_active: true
        }
    }

    #[test_only]
    public fun create_test_community(
        community_id: u64,
        wallet: address,
        ctx: &mut TxContext
    ): Community {
        Community {
            id: object::new(ctx),
            community_id: community_id,
            name: std::string::utf8(b"Test Community"),
            location: std::string::utf8(b"Test Location"),
            wallet_address: wallet,
            total_credits_minted: 0,
            total_revenue: 0
        }
    }

    #[test_only]
    public fun create_test_oracle(
        oracle_addr: address,
        ctx: &mut TxContext
    ): Oracle {
        Oracle {
            id: object::new(ctx),
            oracle_address: oracle_addr,
            is_active: true,
            name: std::string::utf8(b"Test Oracle")
        }
    }
}