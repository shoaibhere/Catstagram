import React from 'react';
import Shoaib from '../../assets/images/Shoaib.jpeg'; // Corrected import path
import Hafsa from '../../assets/images/Hafsa.jpg'; // Corrected import path
import KE from '../../assets/images/K.E.jpg'; // Corrected import path
import Farah from '../../assets/images/Farah.jpg'; // Corrected import path
import Danial from '../../assets/images/Danial.jpg'; // Corrected import path

const Team = () => {
  const teamMembers = [
    { name: 'Hafsa Riaz', image: Hafsa },
    { name: 'Kanz-Ul-Eman Gohar', image: KE},
    { name: 'Farah Eman Javed', image: Farah },
    { name: 'Mian Danial Wajid', image: Danial },
    { name: 'Muhammad Shoaib Akhtar', image: Shoaib },
  ];

  return (
    <section id="team" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-300">Our Catstagram Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                <img src={member.image} alt={member.name} className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-purple-600 bg-opacity-75 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-white text-4xl animate-bounce">🐱</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="text-purple-400 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;

