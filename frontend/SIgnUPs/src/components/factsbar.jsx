import React, { useEffect, useState } from "react";
import axios from "axios";

const Factsbar = () => {
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const response = await axios.get("https://catfact.ninja/facts?limit=100");
        const allFacts = response.data.data;

        // Randomly shuffle facts and select the first 10
        const randomFacts = allFacts
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);

        setFacts(randomFacts);
      } catch (error) {
        console.error("Error fetching cat facts:", error);
      }
    };

    fetchFacts();
  }, []);

  return (
      <div className="w-80 h-full bg-gray-800 p-4 overflow-y-auto shadow-lg">

      <h2 className="text-2xl font-bold text-center text-pink-400 mb-4">
        Random Cat Facts
      </h2>
      <div className="space-y-4">
        {facts.map((fact, index) => (
          <div
            key={index}
            className="p-4 bg-gray-700 rounded-lg shadow text-sm"
          >
            {fact.fact}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Factsbar;
