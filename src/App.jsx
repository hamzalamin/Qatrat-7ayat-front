import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Footer from "./components/layout/Footer/Footer";
import Navbar from "./components/layout/Header/Navbar";
import BloodRequestsSection from "./pages/BloodRequest/BloodRequests";
import BloodType from "./pages/Home/BloodType";
import DonationProcessSection from "./pages/Home/DonationProcess";
import HeroSection from "./pages/Home/Hero";
import LatestArticles from "./pages/Home/LatestArticle";
import LoginPage from "./pages/Auth/login/Login";
import RegistrationForm from "./pages/Auth/Register/Register";

function App() {
  return (
    <>
      <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <BloodRequestsSection />
            <BloodType />
            <LatestArticles />
            <DonationProcessSection />
            {/* <Route path="/articles" element={<Articles />} /> */}
            {/* <Route path="/donors" element={<Donors />} /> */}
            {/* <Route path="/requests" element={<Requests />} /> */}
          </>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
      <Footer />
    </Router>
    </>
  );
}

export default App;
