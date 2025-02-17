import Footer from "./components/layout/Footer/Footer";
import Navbar from "./components/layout/Header/Navbar";
import BloodType from "./pages/Home/BloodType";
import DonationProcessSection from "./pages/Home/DonationProcess";
import HeroSection from "./pages/Home/Hero";
import LatestArticles from "./pages/Home/LatestArticle";

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BloodType />
      <LatestArticles />
      <DonationProcessSection />
      <Footer />
    </>
  );
}

export default App;
