module ecosui::governance {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::vector;
    use std::string::String;
    use sui::clock;

    // ===== STRUCTURES =====
    
    public struct Proposal has key {
        id: UID,
        proposal_id: u64,
        title: String,
        description: String,
        creator: address,
        community_id: u64,
        amount_requested: u64,
        votes_for: u64,
        votes_against: u64,
        voting_end_time: u64,
        is_active: bool,
        is_executed: bool
    }

    public struct Vote has key, store {
        id: UID,
        voter: address,
        proposal_id: u64,
        vote_type: bool, // true = for, false = against
        weight: u64,
        timestamp: u64
    }

    public struct CommunityGovernance has key {
        id: UID,
        community_id: u64,
        total_members: u64,
        active_proposals: vector<u64>,
        treasury_balance: u64,
        next_proposal_id: u64
    }

    public struct ProposalCreatedEvent has copy, drop {
        proposal_id: u64,
        creator: address,
        community_id: u64,
        title: String,
        amount: u64,
        end_time: u64
    }

    public struct VoteEvent has copy, drop {
        proposal_id: u64,
        voter: address,
        vote_type: bool,
        weight: u64
    }

    public struct ProposalExecutedEvent has copy, drop {
        proposal_id: u64,
        passed: bool,
        amount_requested: u64
    }

    // ===== CONSTANTS =====
    
    const ERROR_PROPOSAL_INACTIVE: u64 = 300;
    const ERROR_VOTING_ENDED: u64 = 301;

    // ===== INITIALIZATION =====
    
    fun init(ctx: &mut TxContext) {
        // Initialize with default governance for testing
        let governance = CommunityGovernance {
            id: object::new(ctx),
            community_id: 1,
            total_members: 100,
            active_proposals: vector::empty(),
            treasury_balance: 0,
            next_proposal_id: 1
        };
        transfer::transfer(governance, tx_context::sender(ctx));
    }

    public fun create_governance(community_id: u64, total_members: u64, ctx: &mut TxContext): CommunityGovernance {
        CommunityGovernance {
            id: object::new(ctx),
            community_id: community_id,
            total_members: total_members,
            active_proposals: vector::empty(),
            treasury_balance: 0,
            next_proposal_id: 1
        }
    }

    // ===== PROPOSAL MANAGEMENT =====
    
    public entry fun create_proposal(
        governance: &mut CommunityGovernance,
        title: String,
        description: String,
        amount_requested: u64,
        voting_duration_days: u64,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        let end_time = clock::timestamp_ms(clock) + (voting_duration_days * 24 * 60 * 60 * 1000);
        
        let proposal_id = governance.next_proposal_id;
        governance.next_proposal_id = governance.next_proposal_id + 1;
        
        let proposal = Proposal {
            id: object::new(ctx),
            proposal_id: proposal_id,
            title: title,
            description: description,
            creator: tx_context::sender(ctx),
            community_id: governance.community_id,
            amount_requested: amount_requested,
            votes_for: 0,
            votes_against: 0,
            voting_end_time: end_time,
            is_active: true,
            is_executed: false
        };

        vector::push_back(&mut governance.active_proposals, proposal_id);

        event::emit(ProposalCreatedEvent {
            proposal_id: proposal_id,
            creator: tx_context::sender(ctx),
            community_id: governance.community_id,
            title: title,
            amount: amount_requested,
            end_time: end_time
        });

        transfer::transfer(proposal, tx_context::sender(ctx));
    }

    public entry fun cast_vote(
        _governance: &CommunityGovernance,
        proposal: &mut Proposal,
        vote_type: bool,
        weight: u64,
        clock: &clock::Clock,
        ctx: &mut TxContext
    ) {
        assert!(proposal.is_active, ERROR_PROPOSAL_INACTIVE);
        assert!(clock::timestamp_ms(clock) < proposal.voting_end_time, ERROR_VOTING_ENDED);

        if (vote_type) {
            proposal.votes_for = proposal.votes_for + weight;
        } else {
            proposal.votes_against = proposal.votes_against + weight;
        };

        let vote = Vote {
            id: object::new(ctx),
            voter: tx_context::sender(ctx),
            proposal_id: proposal.proposal_id,
            vote_type: vote_type,
            weight: weight,
            timestamp: clock::timestamp_ms(clock)
        };

        event::emit(VoteEvent {
            proposal_id: proposal.proposal_id,
            voter: tx_context::sender(ctx),
            vote_type: vote_type,
            weight: weight
        });

        transfer::transfer(vote, tx_context::sender(ctx));
    }

    public entry fun execute_proposal(
        governance: &mut CommunityGovernance,
        proposal: &mut Proposal,
        clock: &clock::Clock
    ) {
        assert!(proposal.is_active, ERROR_PROPOSAL_INACTIVE);
        assert!(clock::timestamp_ms(clock) >= proposal.voting_end_time, ERROR_VOTING_ENDED);
        assert!(!proposal.is_executed, ERROR_PROPOSAL_INACTIVE);
        
        let passed = proposal.votes_for > proposal.votes_against;
        proposal.is_active = false;
        proposal.is_executed = true;

        // Remove from active proposals
        let mut i = 0;
        let len = vector::length(&governance.active_proposals);
        while (i < len) {
            if (*vector::borrow(&governance.active_proposals, i) == proposal.proposal_id) {
                vector::remove(&mut governance.active_proposals, i);
                break
            };
            i = i + 1;
        };

        event::emit(ProposalExecutedEvent {
            proposal_id: proposal.proposal_id,
            passed,
            amount_requested: proposal.amount_requested
        });
    }

    // ===== VIEW FUNCTIONS =====
    
    public fun get_proposal_details(proposal: &Proposal): (u64, String, address, u64, u64, u64, bool, bool) {
        (
            proposal.proposal_id,
            proposal.title,
            proposal.creator,
            proposal.votes_for,
            proposal.votes_against,
            proposal.voting_end_time,
            proposal.is_active,
            proposal.is_executed
        )
    }

    public fun get_governance_stats(governance: &CommunityGovernance): (u64, u64, u64, u64) {
        (
            governance.community_id,
            governance.total_members,
            vector::length(&governance.active_proposals),
            governance.treasury_balance
        )
    }

    #[test_only]
    public fun create_test_governance(
        community_id: u64,
        ctx: &mut TxContext
    ): CommunityGovernance {
        CommunityGovernance {
            id: object::new(ctx),
            community_id: community_id,
            total_members: 100,
            active_proposals: vector::empty(),
            treasury_balance: 1000000,
            next_proposal_id: 1
        }
    }

    #[test_only]
    public fun create_test_proposal(
        proposal_id: u64,
        creator: address,
        ctx: &mut TxContext
    ): Proposal {
        Proposal {
            id: object::new(ctx),
            proposal_id: proposal_id,
            title: std::string::utf8(b"Test Proposal"),
            description: std::string::utf8(b"Test Description"),
            creator: creator,
            community_id: 1,
            amount_requested: 1000,
            votes_for: 0,
            votes_against: 0,
            voting_end_time: 0, // Test timestamp
            is_active: true,
            is_executed: false
        }
    }
}