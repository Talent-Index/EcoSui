import React from 'react';
import { Zap, DollarSign, Eye, Shield } from 'lucide-react';

const SolutionSection: React.FC = () => {
  const solutions = [
    {
      icon: <Zap className="h-12 w-12 text-blue-600" />,
      title: "Instant Blockchain Verification",
      description: "Carbon credits minted as NFTs on Sui blockchain in real-time, ensuring immutable and transparent verification."
    },
    {
      icon: <DollarSign className="h-12 w-12 text-green-600" />,
      title: "Direct Community Payments",
      description: "Smart contracts enable factories to buy credits directly from communities, eliminating intermediaries."
    },
    {
      icon: <Eye className="h-12 w-12 text-purple-600" />,
      title: "Transparent Blockchain Tracking",
      description: "Every transaction recorded on-chain with full visibility for all stakeholders through Sui's transparent ledger."
    },
    {
      icon: <Shield className="h-12 w-12 text-orange-600" />,
      title: "Secure Smart Contracts",
      description: "Automated, tamper-proof contracts ensure fair distribution and community fund allocation."
    }
  ];

  return (
    <section id="solution" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Our Solution: 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> EcoSui</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Leveraging Sui blockchain to transform environmental accountability into economic opportunity through decentralized carbon credits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="text-center group hover:bg-gray-50 p-6 rounded-xl transition-all duration-300"
            >
              <div className="bg-white shadow-lg rounded-2xl p-6 group-hover:shadow-xl transition-shadow duration-300 mb-4">
                <div className="flex justify-center mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {solution.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* How it works - Blockchain Focus */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Blockchain-Powered Process for abdi's Community
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data On-Chain</h4>
                    <p className="text-gray-600">Emission data verified and recorded directly on Sui blockchain for transparency.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mint Carbon NFTs</h4>
                    <p className="text-gray-600">Verified emissions data creates tradeable carbon credit NFTs on Sui blockchain.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Decentralized Trading</h4>
                    <p className="text-gray-600">Smart contracts enable direct P2P trading between communities and buyers globally.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Automated Fund Distribution</h4>
                    <p className="text-gray-600">Smart contracts automatically allocate revenue to community health and development funds.</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <img
                  src="https://i.redd.it/nevkp1t7tvt11.jpg"
                  alt="Community blockchain impact"
                  className="rounded-xl shadow-lg"
                />
                <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600">On-chain transparency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;