### EcoSui Interface
![EcoSui Application](https://github.com/Talent-Index/EcoSui/raw/main/WhatsApp%20Image%202025-09-27%20at%2003.38.46_7e7a8274.jpg)

# EcoSui - Breathing Value into Kenya's Pollution Crisis

**Experience EcoSui Live:** [https://eco-sui-ke.netlify.app/](https://eco-sui-ke.netlify.app/)

A revolutionary blockchain application that transforms Kenya's environmental challenges into economic opportunities using Sui technology.

## 🌱 Overview

EcoSui connects Kenyan communities directly to global carbon markets, enabling real-time emissions tracking, carbon credit minting, and transparent reward distribution. Built on Sui blockchain for speed, efficiency, and low transaction costs.

## ✨ Key Features

- **Community Monitoring**: IoT-enabled emission tracking by local communities
- **Instant Verification**: Real-time carbon credit minting on Sui blockchain
- **Direct Trading**: Peer-to-peer carbon credit marketplace
- **Transparent Distribution**: 60% of fees fund community health clinics
- **Health-Linked Credits**: Each credit directly supports medication and clean water

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Blockchain**: Sui Move smart contracts
- **Database**: Supabase for off-chain data
- **Deployment**: Vite build system

## 🏗️ Project Structure

```markdown
Ecosui/
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── utils/
│   │   └── suiIntegration.ts
│   └── components/
│       ├── Header.tsx
│       ├── HeroSection.tsx
│       ├── ProblemSection.tsx
│       ├── SolutionSection.tsx
│       ├── BlockchainSection.tsx
│       ├── CommunitySection.tsx
│       ├── ContactSection.tsx
│       └── Footer.tsx

ecosui-move/
├── Move.toml
├── Move.lock
├── sources/
│   ├── admin.move
│   ├── carbon_credit.move
│   ├── carbon_credits.move
│   ├── community_rewards.move
│   ├── emission_tracker.move
│   ├── governance.move
│   ├── marketplace.move
│   └── payments.move
├── scripts/
│   ├── deploy.sh
│   └── test.sh
├── tests/
│   └── test_ecosui.move
└── build/        # Generated artifacts (omitted for brevity)
```

## 🔧 Smart Contract Integration

### Contract Configuration

The frontend integrates with the Sui Move package in `ecosui-move/`. After publishing, configure the on-chain package and module names used by the UI utilities in `src/utils/suiIntegration.ts`.

Key envs used at runtime:

- `VITE_SUI_PACKAGE_ID` – the package ID returned by `sui client publish`
- `VITE_SUI_NETWORK` – one of `localnet | devnet | testnet | mainnet`

Localnet is supported in the codebase. When `VITE_SUI_NETWORK=localnet`, the app uses `http://127.0.0.1:9000` as RPC; otherwise it uses `getFullnodeUrl(<network>)` from `@mysten/sui.js`.

#### Environment variables

- `VITE_SUI_PACKAGE_ID` — set to the returned `PACKAGE_ID` after `sui client publish`.
- `VITE_SUI_NETWORK` — `'localnet' | 'devnet' | 'testnet' | 'mainnet'` (defaults to `localnet` in code if not set).

### Key Functions (by user flow)

- **Minting and verification**
  - `emission_tracker::verify_emission_data(...)` records sensor data on-chain.

- **Marketplace trading**
  - `marketplace::create_listing(marketplace, credit, price, clk, ctx)` creates a listing for a `CarbonCredit`.
  - `marketplace::execute_trade(marketplace, listing, credit, community, payment, clk, ctx)` distributes payment (60% community, 40% platform), transfers credit, updates stats.
  - `marketplace::cancel_listing(marketplace, listing, clk, ctx)` cancels an active listing by its seller.

- **Community rewards and treasury**
  - `community_rewards::distribute_rewards(community_id, amount, clk)` emits a distribution event (60/40 report).
  - `payments::distribute_payment(payment, amount, community_address, clk, ctx)` splits SUI payment (60/40) and transfers community share.
  - `payments::process_platform_payment(treasury, platform_treasury, platform_payment, ctx)` accounts platform funds.
  - `payments::withdraw_platform_funds(platform_treasury, treasury, amount, recipient, clk, ctx)` withdraws platform funds.

- **Governance**
  - `governance::create_proposal(governance, title, description, amount_requested, voting_duration_days, clk, ctx)`
  - `governance::cast_vote(governance, proposal, vote_type, weight, clk, ctx)`
  - `governance::execute_proposal(governance, proposal, clk)`

- **Admin & config**
  - `admin::update_system_config(admin_cap, system_config, fee_percentage, max_credit_amount, min_credit_amount)`
  - `admin::pause_system(admin_cap, system_config, pause, clock)`
  - `admin::get_system_config(system_config)`

## 🧭 How the smart contracts work (non‑technical)

- **You can measure pollution.** Local youth place simple sensors near factories and rivers. Readings are recorded.
- **Proof goes on-chain.** Verified readings become on-chain objects (like digital certificates) on Sui.
- **Credits are created.** These certificates are minted into carbon credits representing real environmental improvement.
- **Credits are sold.** Buyers (factories, companies) purchase credits to offset emissions.
- **Money flows transparently.** Proceeds are split automatically: 60% to community health/cleanup funds, 40% to platform upkeep.
- **Communities decide.** A governance module lets communities propose and vote on how to deploy funds (e.g., clinics, filters, cleanups).

Everything is traceable, fast, and low-cost because it runs on Sui.

## 🧪 Smart contracts (technical overview)

Contracts reside in `ecosui-move/sources/`:

- `admin.move`
  - Types: `AdminCap`, `SystemConfig`
  - Admin flows: fee settings, pausing, parameter updates.

- `carbon_credits.move`
  - Core credit lifecycle: register oracle/community, mint credits from verified data, helper constructors for tests.
  - Errors are defined as constants for validation paths.
  - Note: Expose `public entry` functions for CLI/UI invocation in the next milestone.

- `marketplace.move`
  - Listing and trade execution for `CarbonCredit` objects.
  - Trade path invokes payments split and transfers credit to buyer.

- `payments.move`
  - Treasury accounting with `Treasury` and `PlatformTreasury` objects.
  - Functions for splitting SUI and processing platform funds.

- `governance.move`
  - `CommunityGovernance`, proposals, votes, and execution logic.

- `emission_tracker.move`, `community_rewards.move`, `carbon_credit.move`
  - Support modules for data recording, reward events, and credit types.

Design notes:

- Uses Sui object model for asset composability and auditability.
- Lints like `duplicate_alias` and `self_transfer` are suppressed/acceptable; functional correctness is preserved.
- Current tests reference internal functions and `test_scenario`; entries will be added to enable direct calls.

## 🌍 Impact Goals

- **30M+ tons** of CO₂ reduction potential annually
- **200+ factories** in Nairobi industrial zone

## 🚀 Getting Started

1. **Clone and install**:
   ```bash
   git clone <repository>
   cd ecosui
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Configure Sui + Localnet**:
   - Start localnet with faucet in Terminal A:
     ```bash
     sui start --with-faucet
     ```
   - In Terminal B, fund an address and select localnet:
     ```bash
     sui client switch --env localnet
     sui client new-address ed25519   # if you need a fresh address
     sui client faucet
     ```
   - Publish contracts (from `ecosui-move/`):
     ```bash
     sui move build
     sui client publish . --gas-budget 100000000
     ```
   - Copy `PACKAGE_ID`, then set `.env`:
     ```
     VITE_SUI_PACKAGE_ID=<YOUR_PACKAGE_ID>
     VITE_SUI_NETWORK=localnet
     ```
   - Restart frontend: `npm run dev`

## 🔗 Integration Points

### Wallet Connection
The application includes wallet integration setup for Sui wallets:
- Connect/disconnect functionality
- Transaction signing
- Account management

### Smart Contract Deployment
Ready for Move contract integration:
- Package deployment configuration
- Module function mapping
- Type definitions for contract interactions

### Real-time Data
IoT sensor integration framework:
- Emission data validation
- Real-time NFT minting
- Community reward distribution

## 🎨 Design System

- **Colors**: Eco-friendly greens, earth tones
- **Typography**: Inter font family
- **Components**: Modular, reusable React components
- **Responsive**: Mobile-first design approach
- **Animations**: Subtle micro-interactions

## 📱 Responsive Design

Optimized for all devices:
- Mobile (<768px)
- Tablet (768px-1024px)
- Desktop (>1024px)

## 🚢 Deployment

Built for production deployment:
```bash
```
# Build (from ecosui-move/)
sui move build

# Publish to the active env (ensure faucet-funded address on localnet)
sui client publish . --gas-budget 100000000
```

Notes:

- Ensure your Sui CLI matches the network protocol to avoid system-package warnings.
- Fund or merge a gas coin large enough for the chosen `--gas-budget`.
- After publishing, save the returned `PACKAGE_ID` for the frontend config.

## 🗺️ Roadmap

- Add `public entry` functions across modules (mint, list, trade, payout, governance actions) for CLI/frontend calls.
- Replace frontend mocks in `src/utils/suiIntegration.ts` with programmable transaction calls.
- Integrate sensor data pipeline/oracle and buyer compliance receipts.
- Launch pilots in Kibera/Mathare with clinic and river cleanup funding tracked on-chain.

## Object IDs to Record (post-deploy)

- `PACKAGE_ID` of this Move package.
- Any initialized app objects (if created):
  - `Marketplace`
  - `Treasury`, `PlatformTreasury`
  - `Community`(ies), `Oracle`(s)
- Framework shared `Clock` object ID for the active network.
