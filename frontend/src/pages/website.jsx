import Navbar from '../components/website/Navbar';
import Hero from '../components/website/Hero';
import Services from '../components/website/Services';
import Activities from '../components/website/Activities';
import Team from '../components/website/Team';
import FAQs from '../components/website/FAQs';
import Contact from '../components/website/Contact';
import Footer from '../components/website/Footer';
import IntroModal from '../components/website/common/IntroModal';
import { ThemeProvider } from '../components/website/ThemeContext';


function App() {
  return (
    <ThemeProvider>
      <div className="App min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <Navbar />
        <Hero />
        <Services />
        <Activities />
        <Team />
        <FAQs />
        <Contact />
        <Footer />
        <IntroModal />
      </div>
    </ThemeProvider>
  );
}

export default App;