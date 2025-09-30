// Sui blockchain integration utilities
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'; // ✅ Match installed package

  // Contract configuration
  export const CONTRACT_CONFIG = {
    // Replace with your actual package ID after deployment
    PACKAGE_ID: (import.meta as any)?.env?.VITE_SUI_PACKAGE_ID || '0x1234567890abcdef1234567890abcdef12345678',
    
    // Contract addresses
    CARBON_CREDIT_MODULE: 'carbon_credit',
    EMISSION_TRACKER_MODULE: 'emission_tracker',
    COMMUNITY_REWARDS_MODULE: 'community_rewards',
    
    // Network configuration
    NETWORK: (((import.meta as any)?.env?.VITE_SUI_NETWORK) || 'localnet') as 'localnet' | 'devnet' | 'testnet' | 'mainnet',
    RPC_URL: ((((import.meta as any)?.env?.VITE_SUI_NETWORK) || 'localnet') === 'localnet')
      ? 'http://127.0.0.1:9000'
      : getFullnodeUrl((((import.meta as any)?.env?.VITE_SUI_NETWORK) || 'localnet') as 'devnet' | 'testnet' | 'mainnet')
  };

// Types for Sui integration
export interface EmissionData {
  co2_level: number;
  particulate_matter: number;
  temperature: number;
  humidity: number;
  sensor_id: string;
  timestamp: number;
}

export interface CarbonCredit {
  id: string;
  amount: number;
  timestamp: number;
  location: string;
  verifier: string;
  community_id: string;
  emission_data: EmissionData;
  development_fund_allocation?: number;
  last_updated?: number;
}

// Sui Client singleton
class SuiIntegration {
  private client: SuiClient | null = null;
  private wallet: any = null;
  private address: string | null = null;
  private isConfigured(): boolean {
    const id = CONTRACT_CONFIG.PACKAGE_ID;
    return typeof id === 'string' && id.startsWith('0x') && id.length > 3 && id !== '0x1234567890abcdef1234567890abcdef12345678';
  }

  // Discover injected Sui wallet providers in the browser
  listWalletProviders(): Array<{ id: string; name: string; provider: any }> {
    if (typeof window === 'undefined') return [];
    const w: any = window as any;

    // Known provider candidates and their common global keys
    const candidates: Array<{ id: string; name: string; key: string }> = [
      { id: 'suiWallet', name: 'Sui Wallet', key: 'suiWallet' }, // official Sui wallet
      { id: 'sui', name: 'Sui Wallet (Standard)', key: 'sui' },
      { id: 'suiet', name: 'Suiet', key: 'suiet' },
      { id: 'ethos', name: 'Ethos', key: 'ethos' },
      { id: 'martian', name: 'Martian', key: 'martian' },
      { id: 'nightly', name: 'Nightly', key: 'nightly' },
      { id: 'suiet', name: 'Suiet (alt)', key: 'suiet' },
    ];

    const found: Array<{ id: string; name: string; provider: any }> = [];
    const seen = new Set<any>();
    for (const c of candidates) {
      const p = w[c.key];
      if (p && !seen.has(p)) {
        seen.add(p);
        found.push({ id: c.id, name: c.name, provider: p });
      }
    }

    // Fallback aggregated array if a wallet injects a list
    if (Array.isArray(w?.suiWallets)) {
      for (const p of w.suiWallets) {
        if (p && !seen.has(p)) {
          seen.add(p);
          const name = p?.name || p?.label || 'Injected Wallet';
          const id = (p?.id || name || 'wallet').toLowerCase().replace(/\s+/g, '-');
          found.push({ id, name, provider: p });
        }
      }
    }

    return found;
  }

  // Initialize Sui client
  async initialize() {
    try {
      this.client = new SuiClient({
        url: CONTRACT_CONFIG.RPC_URL
      });
      console.log('✅ Sui client initialized successfully');
      if (!this.isConfigured()) {
        console.warn('⚠️ EcoSui mock mode: set VITE_SUI_PACKAGE_ID and VITE_SUI_NETWORK to enable live contract calls.');
      }
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Sui client:', error);
      return false;
    }
  }

  // Connect wallet, auto-prefer Sui Wallet ("Slush") if available. Optionally pass a preferred id.
  async connectWallet(preferredId?: string) {
    try {
      console.log('🔗 Connecting wallet...');
      
      // Check if Sui wallet is available
      if (typeof window !== 'undefined') {
        const providers = this.listWalletProviders();

        // Order: preferredId -> Sui Wallet -> others
        let selected = providers.find(p => preferredId && p.id === preferredId);
        if (!selected) selected = providers.find(p => p.id === 'suiWallet' || p.id === 'sui');
        if (!selected) selected = providers[0];

        const injected = selected?.provider;
        if (injected) {
          // Try common connect flows
          if (typeof injected.connect === 'function') {
            await injected.connect();
          } else if (injected?.features?.['standard:connect']?.connect) {
            await injected.features['standard:connect'].connect();
          } else if (typeof injected.requestPermissions === 'function') {
            try { await injected.requestPermissions(); } catch {}
          }

          // Resolve address via common APIs
          let addr: string | undefined = injected.address;
          if (!addr && typeof injected.getAccounts === 'function') {
            const accounts = await injected.getAccounts();
            addr = accounts?.[0]?.address || accounts?.[0]?.addr || accounts?.[0];
          } else if (!addr && injected?.features?.['sui:accounts']?.getAccounts) {
            const accounts = await injected.features['sui:accounts'].getAccounts();
            addr = accounts?.[0]?.address;
          }

          if (!addr || !/^0x[a-fA-F0-9]{1,64}$/.test(addr)) {
            console.warn('⚠️ Connected to wallet but could not determine address.');
          }

          this.wallet = injected;
          this.address = addr || null;
          console.log(`✅ Wallet connected using ${selected?.name || 'Injected Wallet'}:`, this.address || '(unknown)');
        } else {
          // Mock wallet for development
          this.wallet = {
            address: '0x' + Array.from({ length: 40 }, () =>
              Math.floor(Math.random() * 16).toString(16)).join(''),
            connected: true
          };
          this.address = this.wallet.address;
          console.log('🔧 Using mock wallet for development');
        }
      }
      
      return { wallet: this.wallet, address: this.address };
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      return null;
    }
  }

  getAddress(): string | null {
    return this.address;
  }

  isConnected(): boolean {
    return !!this.wallet && (this.address?.startsWith('0x') ?? false);
  }

  async disconnect() {
    try {
      if (this.wallet?.disconnect) {
        await this.wallet.disconnect();
      }
    } catch {}
    this.wallet = null;
    this.address = null;
  }

  // Sign a human-readable message with the wallet (no on-chain gas required)
  async signMessage(message: string) {
    if (!this.wallet) throw new Error('Wallet not connected');
    const bytes = new TextEncoder().encode(message);

    // Try wallet-standard first
    if (this.wallet?.features?.['sui:signPersonalMessage']?.signPersonalMessage) {
      const res = await this.wallet.features['sui:signPersonalMessage'].signPersonalMessage({
        message: bytes,
      });
      return res; // contains signature, bytes, address
    }

    // Fallback to legacy APIs
    if (typeof this.wallet.signPersonalMessage === 'function') {
      return await this.wallet.signPersonalMessage({ message: bytes });
    }

    throw new Error('This wallet does not support signing personal messages');
  }

  // Mint carbon credit
  async mintCarbonCredit(emissionData: EmissionData, communityId: string) {
    if (!this.client) {
      throw new Error('❌ Sui client not initialized');
    }

    try {
      // For now, return mock data since we don't have actual contract
      console.log('🌱 Minting carbon credit for community:', communityId);
      
      const mockCredit = {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        creditId: '0xcredit_' + Date.now().toString(16),
        amount: emissionData.co2_level * 100, // Convert CO2 to credits
        timestamp: Date.now()
      };
      
      console.log('✅ Carbon credit minted:', mockCredit);
      return mockCredit;
    } catch (error) {
      console.error('❌ Failed to mint carbon credit:', error);
      throw error;
    }
  }

  // Trade carbon credit
  async tradeCarbonCredit(creditId: string, buyerAddress: string, price: number) {
    if (!this.client) {
      throw new Error('❌ Sui client not initialized');
    }

    try {
      console.log('💰 Trading carbon credit:', { creditId, buyerAddress, price });
      
      const mockTrade = {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        creditId,
        buyerAddress,
        price,
        timestamp: Date.now()
      };
      
      return mockTrade;
    } catch (error) {
      console.error('❌ Failed to trade carbon credit:', error);
      throw error;
    }
  }

  // Verify emission data
  async verifyEmissionData(sensorId: string, data: Partial<EmissionData>) {
    if (!this.client) {
      throw new Error('❌ Sui client not initialized');
    }

    try {
      console.log('🔍 Verifying emission data from sensor:', sensorId);
      
      const verification = {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        verified: true,
        sensorId,
        timestamp: Date.now(),
        dataQuality: 'high' // Mock data quality assessment
      };
      
      return verification;
    } catch (error) {
      console.error('❌ Failed to verify emission data:', error);
      throw error;
    }
  }

  // Distribute rewards to community
  async distributeRewards(communityId: string, amount: number) {
    if (!this.client) {
      throw new Error('❌ Sui client not initialized');
    }

    try {
      console.log('🎁 Distributing rewards to community:', communityId);
      
      const distribution = {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        communityId,
        totalAmount: amount,
        healthFund: Math.floor(amount * 0.6), // 60% to health fund
        developmentFund: Math.floor(amount * 0.4), // 40% to development fund
        timestamp: Date.now()
      };
      
      return distribution;
    } catch (error) {
      console.error('❌ Failed to distribute rewards:', error);
      throw error;
    }
  }

  // Get carbon credits for a community
  async getCommunityCredits(communityId: string): Promise<CarbonCredit[]> {
    if (!this.client) {
      throw new Error('❌ Sui client not initialized');
    }

    try {
      console.log('📊 Fetching credits for community:', communityId);
      
      // Mock data for development
      const mockCredits: CarbonCredit[] = [
        {
          id: '0xcredit_' + Date.now(),
          amount: 150,
          timestamp: Date.now() - 86400000,
          location: 'Kibera, Nairobi',
          verifier: '0xverifier_001',
          community_id: communityId,
          emission_data: {
            co2_level: 350,
            particulate_matter: 45,
            temperature: 28,
            humidity: 65,
            sensor_id: 'sensor_kibera_001',
            timestamp: Date.now() - 86400000
          }
        },
        {
          id: '0xcredit_' + (Date.now() - 1000),
          amount: 200,
          timestamp: Date.now() - 172800000,
          location: 'Mathare, Nairobi',
          verifier: '0xverifier_002',
          community_id: communityId,
          emission_data: {
            co2_level: 420,
            particulate_matter: 68,
            temperature: 26,
            humidity: 70,
            sensor_id: 'sensor_mathare_001',
            timestamp: Date.now() - 172800000
          }
        }
      ];
      
      return mockCredits;
    } catch (error) {
      console.error('❌ Failed to fetch community credits:', error);
      throw error;
    }
  }

  // Get current Sui balance (utility function)
  async getBalance(address?: string) {
    if (!this.client) {
      throw new Error('❌ Sui client not initialized');
    }

    try {
      const addr = address || this.wallet?.address;
      if (!addr) throw new Error('No address provided');
      
      // Mock balance for development
      return {
        address: addr,
        balance: Math.random() * 1000, // Random balance for demo
        symbol: 'SUI'
      };
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const suiIntegration = new SuiIntegration();

// Utility functions
export const formatSuiAddress = (address: string): string => {
  if (!address || address.length <= 12) return address || 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const validateSuiAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{1,64}$/.test(address);
};

// Initialize Sui integration on import
suiIntegration.initialize().then(success => {
  if (success) {
    console.log('🚀 EcoSui Sui Integration Ready!');
  }
});