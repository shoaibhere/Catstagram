import React from 'react';
import Activities1 from '../../assets/images/Activities1.jpg'; // Corrected import path

const Activities = () => {
  const stats = [
    { number: '1M+', label: 'Paw Accounts' },
    { number: '50K+', label: 'Posts' },
    { number: '250K+', label: 'Likes' },
    { number: '500K+', label: 'Happy Kittens' },
    { number: '20+', label: 'Countries Connected' },
    { number: '2M+', label: 'Monthly Visits' }
  ];

  return (
    <section id="activities" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-white">We will make them truly happy</h3>
            <p className="text-gray-300 mb-8">Our dedicated team ensures that our every paw-customer receives the love and care by providing them a platform where they can enjoy their time with each other.</p>
            <img src={Activities1} alt="Happy Pets" className="rounded-lg shadow-lg" />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-6 text-white">We are working for the community</h3>
            <p className="text-gray-300 mb-8">Catstagram is committed to improving the lifestyle of cats.</p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-700 p-6 rounded-lg text-center">
                  <h4 className="text-4xl font-bold text-purple-400 mb-2">{stat.number}</h4>
                  <p className="text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
