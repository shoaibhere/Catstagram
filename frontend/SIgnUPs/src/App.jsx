import React from "react";
import SideNav from "./components/sideNav";
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
      <SideNav />
    </>
  );
};

export default App;
