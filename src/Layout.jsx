import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Footer from "./components/layout/Footer/Footer";
import Navbar from "./components/layout/Header/Navbar";
import BloodRequestsSection from "./pages/BloodRequest/BloodRequests";
import BloodType from "./pages/Home/BloodType";
import DonationProcessSection from "./pages/Home/DonationProcess";
import HeroSection from "./pages/Home/Hero";
import LatestArticles from "./pages/Home/LatestArticle";
import LoginPage from "./pages/Auth/login/Login";
import RegistrationForm from "./pages/Auth/Register/Register";
import AdminLayout from "./pages/Admin/AdminLayout";
import Sidebar from "./components/layout/Sidebar/Sidebar";

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("admin/dashboard");

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <BloodRequestsSection />
              <BloodType />
              <LatestArticles />
              <DonationProcessSection />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationForm />} />

        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<Sidebar />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}

    </>
  );
}

export default Layout;
