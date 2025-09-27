import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import BlockchainSection from './components/BlockchainSection';
import CommunitySection from './components/CommunitySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { suiIntegration } from './utils/suiIntegration';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [suiReady, setSuiReady] = useState(false);

  useEffect(() => {
    // Initialize Sui integration
    const initializeSui = async () => {
      try {
        const initialized = await suiIntegration.initialize();
        setSuiReady(initialized);
        console.log('Sui integration ready:', initialized);
      } catch (error) {
        console.error('Failed to initialize Sui integration:', error);
      }
    };

    initializeSui();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BlockchainSection />
      <CommunitySection />
      <ContactSection />
      <Footer />
      
      {/* Sui Integration Status */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          suiReady 
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              suiReady ? 'bg-emerald-500' : 'bg-yellow-500'
            } animate-pulse`}></div>
            <span>Sui {suiReady ? 'Ready' : 'Connecting'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;