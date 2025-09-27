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

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation and branding
│   ├── HeroSection.tsx # Main landing section
│   ├── ProblemSection.tsx # Problem showcase
│   ├── SolutionSection.tsx # Solution presentation
│   ├── BlockchainSection.tsx # Blockchain integration info
│   ├── CommunitySection.tsx # Community impact
│   ├── ContactSection.tsx # Contact form
│   └── Footer.tsx      # Footer navigation
├── utils/
│   └── suiIntegration.ts # Sui blockchain utilities
├── App.tsx             # Main application
└── main.tsx           # Application entry point
```

## 🔧 Smart Contract Integration

### Contract Configuration

The application is configured to integrate with Sui Move contracts:

```typescript
const CONTRACT_CONFIG = {
  PACKAGE_ID: '0x1234567890abcdef1234567890abcdef12345678',
  MODULES: {
    CARBON_CREDIT: 'carbon_credit',
    EMISSION_TRACKER: 'emission_tracker',
    COMMUNITY_REWARDS: 'community_rewards'
  }
};
```

### Key Functions

- `mint_carbon_credit()` - Create carbon credits from verified data
- `trade_credit()` - Execute peer-to-peer trading
- `verify_emission()` - Validate IoT sensor data
- `distribute_rewards()` - Auto-distribute community payments

## 📊 Business Model

- **5% transaction fee** on all carbon credit trades
- **60% reinvestment** into community health clinics
- **40% platform development** and expansion

## 🌍 Impact Goals

- **30M+ tons** of CO₂ reduction potential annually
- **200+ factories** in Nairobi industrial zone
- **19K+ lives** potentially improved through cleaner air

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
npm run build
npm run preview
```

## 📄 License

Built for positive environmental and social impact in Kenya.

---

**EcoSui**: We're not just tracking carbon. We're trading dignity. 🌱
