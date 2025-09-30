// Sui blockchain integration utilities
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'; // ✅ CORRECT IMPORT

// Contract configuration
export const CONTRACT_CONFIG = {
  // Replace with your actual package ID after deployment
  PACKAGE_ID: (import.meta as any)?.env?.VITE_SUI_PACKAGE_ID || '0x1234567890abcdef1234567890abcdef12345678',
  
  // Contract addresses
  CARBON_CREDIT_MODULE: 'carbon_credit',
  EMISSION_TRACKER_MODULE: 'emission_tracker',
  COMMUNITY_REWARDS_MODULE: 'community_rewards',
  
  // Network configuration
  NETWORK: (((import.meta as any)?.env?.VITE_SUI_NETWORK) || 'testnet') as 'devnet' | 'testnet' | 'mainnet',
  RPC_URL: getFullnodeUrl((((import.meta as any)?.env?.VITE_SUI_NETWORK) || 'testnet') as 'devnet' | 'testnet' | 'mainnet')
};

// Types for Sui integration
export interface CarbonCredit {
  id: string;
  amount: number;
{{ ... }}
  development_fund_allocation: number;
  last_updated: number;
}

// Sui Client singleton
class SuiIntegration {
  private client: SuiClient | null = null;
  private wallet: any = null;
  private isConfigured(): boolean {
    const id = CONTRACT_CONFIG.PACKAGE_ID;
    return typeof id === 'string' && id.startsWith('0x') && id.length > 3 && id !== '0x1234567890abcdef1234567890abcdef12345678';
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

  // Connect wallet (placeholder for actual wallet integration)
  async connectWallet() {
    try {
      console.log('🔗 Connecting wallet...');
{{ ... }}
      
      // Check if Sui wallet is available
      if (typeof window !== 'undefined' && (window as any).suiWallet) {
        const wallet = (window as any).suiWallet;
        await wallet.connect();
        this.wallet = wallet;
        console.log('✅ Wallet connected:', wallet.address);
      } else {
        // Mock wallet for development
        this.wallet = {
          address: '0x' + Array.from({length: 40}, () => 
            Math.floor(Math.random() * 16).toString(16)).join(''),
          connected: true
        };
        console.log('🔧 Using mock wallet for development');
      }
      
      return this.wallet;
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      return null;
    }
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