import React from 'react';
import Navbar from '../components/website/Navbar';
import Hero from '../components/website/Hero';
import Services from '../components/website/Services';
import Activities from '../components/website/Activities';
import Team from '../components/website/Team';
import FAQs from '../components/website/FAQs';
import Contact from '../components/website/Contact';
import Footer from '../components/website/Footer';


function Website() {
  return (
    <div className="App bg-gray-900 text-white min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Activities />
      <Team />
      <FAQs />
      <Contact />
      <Footer />
    </div>
  );
}

export default Website;


