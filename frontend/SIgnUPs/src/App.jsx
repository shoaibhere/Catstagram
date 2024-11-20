import React from "react";
import SideNav from "./components/sideNav";
import Navbar from "./components/navbar";

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
