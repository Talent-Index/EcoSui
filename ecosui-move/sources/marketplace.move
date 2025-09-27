module ecosui::marketplace {
    
    
    
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use ecosui::carbon_credits::{CarbonCredit, Community};
    use ecosui::payments;
    use sui::clock;

    // ===== STRUCTURES =====
    
    public struct Listing has key {
        id: UID,
        credit_id: ID,
        seller: address,
        price: u64,
        is_active: bool,
        created_at: u64
    }

    public struct TradeEvent has copy, drop {
        listing_id: ID,
        credit_id: ID,
        buyer: address,
        seller: address,
        price: u64,
        timestamp: u64
    }

    public struct Marketplace has key {
        id: UID,
        total_listings: u64,
        total_volume: u64
    }

    public struct ListingCreatedEvent has copy, drop {
        listing_id: ID,
        credit_id: ID,
        seller: address,
        price: u64,
        created_at: u64
    }

    public struct ListingCancelledEvent has copy, drop {
        listing_id: ID,
        seller: address,
        timestamp: u64
    }

    // ===== CONSTANTS =====
    
    const ERROR_NOT_OWNER: u64 = 100;
    const ERROR_LISTING_INACTIVE: u64 = 101;
    const ERROR_INSUFFICIENT_FUNDS: u64 = 102;
    const ERROR_CREDIT_INACTIVE: u64 = 103;

    // ===== INITIALIZATION =====
    
    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            total_listings: 0,
            total_volume: 0
        };
        transfer::transfer(marketplace, tx_context::sender(ctx));
    }

    // ===== LISTING MANAGEMENT =====
    
    public fun create_listing(
        marketplace: &mut Marketplace,
        credit: &CarbonCredit,
        price: u64,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        assert!(ecosui::carbon_credits::is_credit_active(credit), ERROR_CREDIT_INACTIVE);

        let listing_uid = object::new(ctx);
        let listing_id = object::uid_to_inner(&listing_uid);
        let listing = Listing {
            id: listing_uid,
            credit_id: object::id(credit),
            seller: tx_context::sender(ctx),
            price: price,
            is_active: true,
            created_at: clock::timestamp_ms(clock)
        };

        marketplace.total_listings = marketplace.total_listings + 1;

        event::emit(ListingCreatedEvent {
            listing_id,
            credit_id: object::id(credit),
            seller: tx_context::sender(ctx),
            price,
            created_at: listing.created_at
        });

        transfer::transfer(listing, tx_context::sender(ctx));
    }

    public fun cancel_listing(
        _marketplace: &mut Marketplace,
        listing: &mut Listing,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        assert!(listing.seller == tx_context::sender(ctx), ERROR_NOT_OWNER);
        listing.is_active = false;

        event::emit(ListingCancelledEvent {
            listing_id: object::uid_to_inner(&listing.id),
            seller: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock)
        });
    }

    // ===== TRADE EXECUTION =====
    
    public fun execute_trade(
        marketplace: &mut Marketplace,
        listing: &mut Listing,
        credit: CarbonCredit,
        community: &mut Community,
        payment: &mut Coin<SUI>,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        assert!(listing.is_active, ERROR_LISTING_INACTIVE);
        assert!(ecosui::carbon_credits::is_credit_active(&credit), ERROR_CREDIT_INACTIVE);
        assert!(coin::value(payment) >= listing.price, ERROR_INSUFFICIENT_FUNDS);

        let buyer = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Distribute payment (60% community, 40% platform)
        payments::distribute_payment(
            payment,
            listing.price,
            ecosui::carbon_credits::get_community_wallet(community),
            clock,
            ctx
        );

        // Transfer credit to buyer
        transfer::public_transfer(credit, buyer);

        // Update community revenue
        ecosui::carbon_credits::update_community_revenue(community, listing.price);

        // Update marketplace stats
        marketplace.total_volume = marketplace.total_volume + listing.price;

        // Deactivate listing
        listing.is_active = false;

        event::emit(TradeEvent {
            listing_id: object::uid_to_inner(&listing.id),
            credit_id: listing.credit_id,
            buyer,
            seller: listing.seller,
            price: listing.price,
            timestamp
        });
    }

    // ===== VIEW FUNCTIONS =====
    
    public fun get_listing_details(listing: &Listing): (ID, address, u64, bool, u64) {
        (
            listing.credit_id,
            listing.seller,
            listing.price,
            listing.is_active,
            listing.created_at
        )
    }

    public fun get_marketplace_stats(marketplace: &Marketplace): (u64, u64) {
        (marketplace.total_listings, marketplace.total_volume)
    }

    #[test_only]
    public fun create_test_listing(
        credit_id: ID,
        seller: address,
        price: u64,
        ctx: &mut TxContext
    ): Listing {
        Listing {
            id: object::new(ctx),
            credit_id: credit_id,
            seller: seller,
            price: price,
            is_active: true,
            created_at: 0 // Test timestamp
        }
    }

    #[test_only]
    public fun create_test_marketplace(ctx: &mut TxContext): Marketplace {
        Marketplace {
            id: object::new(ctx),
            total_listings: 0,
            total_volume: 0
        }
    }
}