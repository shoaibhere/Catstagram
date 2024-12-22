import React from "react";

const Team = () => {
  const teamMembers = [
    {
      name: "Hafsa Riaz",
      image: "../src/assets/images/Hafsa.jpg?height=300&width=300",
    },
    {
      name: "Kanz-Ul-Eman",
      image: "../src/assets/images/K.E.jpg?height=300&width=300",
    },
    {
      name: "Farah Eman Javed",
      image: "../src/assets/images/Farah.jpg?height=300&width=300",
    },
    {
      name: "Mian Danial Wajid",
      image: "../src/assets/images/Danial.jpg?height=300&width=300",
    },
    {
      name: "Muhammad Shoaib Akhtar",
      image: "../src/assets/images/Shoaib.jpeg?height=300&width=300",
    },
  ];

  return (
    <section
      id="team"
      className="pt-8 border-t border-purple-900 dark:border-purple-900 py-20 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          Our Catstagram Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-purple-500 bg-opacity-75 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-white text-4xl animate-bounce">🐱</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {member.name}
              </h3>
              <p className="text-purple-600 dark:text-purple-300 font-medium">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
