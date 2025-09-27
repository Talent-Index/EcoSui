import React from 'react';
import { Users, TrendingUp, Heart, Target } from 'lucide-react';

const CommunitySection: React.FC = () => {
  const impacts = [
    {
      value: "60%",
      label: "Community Health Clinics",
      description: "Transaction fees reinvested into healthcare"
    },
    {
      value: "40%",
      label: "Platform Development", 
      description: "Continuous improvement and expansion"
    },
    {
      value: "5%",
      label: "Transaction Fee",
      description: "Sustainable business model"
    }
  ];

  const uniqueFeatures = [
    {
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      title: "Community-First",
      description: "We pay communities, not middlemen"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      title: "Health-Linked Credits",
      description: "Each credit funds asthma medication, clean water"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-600" />,
      title: "Made in Kenya",
      description: "Built by Kenyans who breathe this air daily"
    },
    {
      icon: <Target className="h-6 w-6 text-purple-600" />,
      title: "Justice Delivered",
      description: "Digitized, decentralized, and delivered"
    }
  ];

  return (
    <section id="community" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Business Model */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Transaction Fees That Heal
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our sustainable business model ensures every transaction contributes to community health and platform growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {impacts.map((impact, index) => (
            <div
              key={index}
              className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl font-bold text-emerald-600 mb-4">{impact.value}</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">{impact.label}</div>
              <div className="text-gray-600">{impact.description}</div>
            </div>
          ))}
        </div>

        {/* Why We're Uniquely Kenyan */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why We're Uniquely Kenyan
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're not just another crypto project. We understand the challenges because we live them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 hover:bg-gray-50 rounded-xl transition-colors duration-300"
              >
                <div className="bg-white shadow-lg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Vision */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 lg:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">The Future We See</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl font-bold mb-3">🏥</div>
                <div className="font-semibold mb-2">Health Transformation</div>
                <div className="text-sm">Wanjiku's asthma clinic funded by the very factories that polluted her air</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl font-bold mb-3">🌊</div>
                <div className="font-semibold mb-2">Clean Environment</div>
                <div className="text-sm">Nairobi River clean enough for children to play in</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl font-bold mb-3">🌍</div>
                <div className="font-semibold mb-2">Global Impact</div>
                <div className="text-sm">Kenyan communities becoming carbon credit exporters to the world</div>
              </div>
            </div>

            <blockquote className="text-2xl font-medium mb-6 italic">
              "We're not just tracking carbon. We're trading dignity."
            </blockquote>
            
            <div className="text-lg">
              EcoSui isn't just another crypto project. It's justice—digitized, decentralized, and delivered.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;