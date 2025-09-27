import React from 'react';
import { Droplets, Wind, Factory, Heart } from 'lucide-react';

const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <Droplets className="h-8 w-8 text-blue-600" />,
      title: "Polluted Water",
      stat: "2,800 tons",
      description: "Nairobi River carries plastic waste annually into communities",
      image: "https://images.pexels.com/photos/15060365/pexels-photo-15060365.jpeg"
    },
    {
      icon: <Wind className="h-8 w-8 text-gray-600" />,
      title: "Air Pollution",
      stat: "19,000+",
      description: "Premature deaths yearly caused by poor air quality",
      image: "https://i.pinimg.com/1200x/29/fb/84/29fb846a67cba90f9cd4543d3267c2fa.jpg"
    },
    {
      icon: <Factory className="h-8 w-8 text-orange-600" />,
      title: "Industrial Waste",
      stat: "200+",
      description: "Factories dumping untreated waste in industrial zones",
      image: "https://i.pinimg.com/1200x/4a/05/5a/4a055a026019e0066559a055492d8695.jpg"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Health Crisis",
      stat: "Millions",
      description: "People suffering while global carbon markets exclude them",
      image: "https://tse3.mm.bing.net/th/id/OIP.EPjpz0lTh7KOMl7DoTB4gAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"
    }
  ];

  return (
    <section id="problem" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Problem I Witnessed
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            I watched my friend abdi develop chronic asthma at 12,not from genetics, but from breathing 
            Nairobi's industrial air. he lived in Kibera, where the Nairobi River carries more plastic than water.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={problem.image}
                  alt={problem.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-lg">
                  {problem.icon}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{problem.title}</h3>
                  <span className="text-2xl font-bold text-emerald-600">{problem.stat}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <img
                src="https://thumbs.dreamstime.com/z/life-women-disabled-child-slum-nairobi-kenya-city-capital-naroibi-group-portrait-handicapped-boy-which-hangs-49778357.jpg"
                alt="Mama Wanjiku"
                className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-emerald-500"
              />
            </div>
            <blockquote className="text-2xl font-medium text-gray-900 mb-6 italic">
              "Why should my child cough through the night because a factory won't install filters? 
              Why does our suffering have no value in the global economy?"
            </blockquote>
            <cite className="text-lg text-emerald-600 font-semibold">— Mama abdi, Kibera resident</cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;