import React from 'react';
import { Blocks, Zap, Shield, Globe } from 'lucide-react';

const BlockchainSection: React.FC = () => {
  const features = [
    {
      icon: <Blocks className="h-8 w-8 text-blue-600" />,
      title: "Sui-Powered Speed",
      description: "Instant settlements vs. 6-month traditional verification",
      benefit: "Real-time transactions"
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Transparent & Secure",
      description: "Immutable records ensure trust and accountability",
      benefit: "100% verifiable"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Smart Automation",
      description: "Automated payments when emission targets are met",
      benefit: "Zero intermediaries"
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "Global Marketplace",
      description: "Connect Kenyan communities to worldwide carbon markets",
      benefit: "Maximum value"
    }
  ];

  return (
    <section id="blockchain" className="py-20 bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Powered by Sui Blockchain
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            We leverage Sui's high-speed, low-cost blockchain technology to make carbon trading 
            accessible, transparent, and profitable for Kenyan communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
              <div className="inline-flex items-center text-emerald-400 font-medium">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                {feature.benefit}
              </div>
            </div>
          ))}
        </div>

        {/* Contract Integration Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Smart Contract Integration</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/10 rounded-lg p-6">
                  <h4 className="font-semibold mb-3 text-emerald-400">Contract Address</h4>
                  <code className="text-sm font-mono bg-black/30 p-3 rounded block">
                    0x1234...abcd
                  </code>
                  <p className="text-sm text-gray-300 mt-2">
                    Main EcoSui contract for carbon credit minting and trading
                  </p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-6">
                  <h4 className="font-semibold mb-3 text-blue-400">Package ID</h4>
                  <code className="text-sm font-mono bg-black/30 p-3 rounded block">
                    0x5678...efgh
                  </code>
                  <p className="text-sm text-gray-300 mt-2">
                    Published Move package identifier
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Key Functions</h4>
                
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-mono text-sm text-emerald-400">mint_carbon_credit()</div>
                    <div className="text-xs text-gray-300 mt-1">Create new carbon credits from verified data</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-mono text-sm text-blue-400">trade_credit()</div>
                    <div className="text-xs text-gray-300 mt-1">Execute peer-to-peer credit trading</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-mono text-sm text-purple-400">verify_emission()</div>
                    <div className="text-xs text-gray-300 mt-1">Validate IoT sensor data on-chain</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-mono text-sm text-yellow-400">distribute_rewards()</div>
                    <div className="text-xs text-gray-300 mt-1">Auto-distribute payments to communities</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                View Contract Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;