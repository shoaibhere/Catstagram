// import React from "react";

// const App = () => {
//   const name = "john";
//   const array = ["1", "2", "3", "4"];
//   const check = true;
//   const styles = {
//     color: "red",
//     fontSize: "20px",
//   };
//   return (
//     <div classNameName="text-5xl bg-gray-100 h-5">
//       {name}
//       <p style={styles}>Hello {name}</p>
//       <ul>
//         {array.map((item, index) => (
//           <li key={index}>{item}</li>
//         ))}
//       </ul>
//       {check ? <p>True</p> : <p>False</p>}
//       {/* {check && <p>True</p>} only to show if true */}
//     </div>
//   );
// };

// export default App;

import React from "react";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import HomeCards from "./components/homeCards";
import JobListing from "./components/jobListing";
import ViewAll from "./components/viewAll";
const App = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Billabong&display=swap"
        rel="stylesheet"
      ></link>
      <Navbar />
      <Hero />
      <HomeCards />
      <JobListing />
      <ViewAll />
    </>
  );
};

export default App;
