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
.
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

The frontend integrates with the Sui Move package in `ecosui-move/`. After publishing, configure the on-chain package and module names used by the UI utilities in `src/utils/suiIntegration.ts`:
```typescript
export const CONTRACT_CONFIG = {
  // Populated from VITE_SUI_PACKAGE_ID at runtime; replace fallback after publishing
  PACKAGE_ID: import.meta.env.VITE_SUI_PACKAGE_ID || '0x1234567890abcdef1234567890abcdef12345678',

  // Module names expected by the frontend utilities
  CARBON_CREDIT_MODULE: 'carbon_credit',        // wrapper forwarding to carbon_credits
  EMISSION_TRACKER_MODULE: 'emission_tracker',
  COMMUNITY_REWARDS_MODULE: 'community_rewards',

  // Optional additional modules available in this package
  MARKETPLACE_MODULE: 'marketplace',
  PAYMENTS_MODULE: 'payments',
  GOVERNANCE_MODULE: 'governance',
  ADMIN_MODULE: 'admin',

  // Network is driven by VITE_SUI_NETWORK ('devnet' | 'testnet' | 'mainnet')
  NETWORK: (import.meta.env.VITE_SUI_NETWORK || 'testnet') as 'devnet' | 'testnet' | 'mainnet',
};
```

#### Environment variables

- `VITE_SUI_PACKAGE_ID` — set to the returned `PACKAGE_ID` after `sui client publish`.
- `VITE_SUI_NETWORK` — `'devnet' | 'testnet' | 'mainnet'` (defaults to `testnet`).

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

3. **Configure Sui integration**:
   - Deploy Move contracts to Sui network
   - Update `CONTRACT_CONFIG` with actual package IDs
   - Connect wallet integration (Suiet, Ethos, etc.)

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
# Build
sui move build --path ecosui-move

# Publish (ensure sufficient gas and a current CLI)
sui client publish --json --skip-fetch-latest-git-deps --gas-budget 50000000 --path ecosui-move
```

Notes:

- Ensure your Sui CLI matches the network protocol to avoid system-package warnings.
- Fund or merge a gas coin large enough for the chosen `--gas-budget`.
- After publishing, save the returned `PACKAGE_ID` for the frontend config.

## Object IDs to Record (post-deploy)

- `PACKAGE_ID` of this Move package.
- Any initialized app objects (if created):
  - `Marketplace`
  - `Treasury`, `PlatformTreasury`
  - `Community`(ies), `Oracle`(s)
- Framework shared `Clock` object ID for the active network.
