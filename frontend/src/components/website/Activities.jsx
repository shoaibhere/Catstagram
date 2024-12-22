import React from "react";
import {
  TrendingUp,
  Rocket,
  Heart,
  SmilePlus,
  PlusCircle,
  SquareArrowUp,
} from "lucide-react";

const Activities = () => {
  const stats = [
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />,
      label: "Paw Accounts",
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple-400 mx-auto mb-2" />,
      label: "Posts",
    },
    {
      icon: <Heart className="w-8 h-8 text-purple-400 mx-auto mb-2" />,
      label: "Likes",
    },
    {
      icon: <SmilePlus className="w-8 h-8 text-purple-400 mx-auto mb-2" />,
      label: "Happy Kittens",
    },
    {
      icon: <PlusCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />,
      label: "Countries Connected",
    },
    {
      icon: <SquareArrowUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />,
      label: "Monthly Visits",
    },
  ];

  return (
    <section
      id="activities"
      className="pt-8 border-t border-purple-900 dark:border-purple-900 py-20 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              We will make them truly happy
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Our dedicated team ensures that our every paw-customer receives
              the love and care by providing them a platform where they can
              enjoy their time with each other.
            </p>
            <img
              src="../src/assets/images/Activities1.jpg" // Make sure this path is correct or use an absolute URL
              alt="Happy Pets"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              We are working for the community
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Catstagram is committed to improving the lifestyle of cats.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center"
                >
                  <div className="mb-4">{stat.icon}</div>
                  <h4 className="text-4xl font-bold text-purple-500 dark:text-purple-300 mb-2">
                    {stat.number}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
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
