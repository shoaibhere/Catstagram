import React from 'react';
import { PawPrint, Heart, Sparkles } from 'lucide-react';

const Services = () => {
  const services = [
    { icon: PawPrint, title: 'Paw-erful Connections', description: 'Through our app you can connect to your surrounding paw-community.' },
    { icon: Heart, title: 'Purr-fect Interactions', description: 'You can interact with eachother by liking posts.' },
    { icon: Sparkles, title: 'Mood Lifting', description: 'Our app will lift your mood by leaving a big smiles on your faces.' },
  ];

  return (
    <section id="services" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-300">How We Cater to Your Cat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center bg-gray-700 p-8 rounded-lg shadow-lg transition duration-300 hover:shadow-xl transform hover:-translate-y-2 hover:bg-gray-600">
              <service.icon className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

