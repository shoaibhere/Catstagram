import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../contexts/themeContext"; // Ensure the path is correct

const Factsbar = () => {
  const [facts, setFacts] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const response = await axios.get("https://catstagram-production.up.railway.app/api/catfacts");
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
    <div className={`w-80 h-full p-4 overflow-y-auto ${
      theme === "dark" ? "bg-black text-white" : "bg-white text-black"
    }`}>
      <h2 className={`text-2xl font-bold text-center mb-4 ${
        theme === "dark" ? "text-pink-400" : "text-purple-500"
      }`}>
        Random Cat Facts
      </h2>
      <div className="space-y-4">
        {facts.map((fact, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md text-sm ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            } border ${
              theme === "dark" ? "border-gray-600" : "border-purple-300"
            }`}
          >
            {fact.fact}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Factsbar;
