import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import AdminStatistics from "./pages/Admin/AdminStatistic";
import ArticleManagement from "./pages/Admin/ArticleManagment";
import UserManagement from "./pages/Admin/UsersManagment";

function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
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
            <Route index element={<AdminStatistics />} />
            <Route path="article-management" element={<ArticleManagement />} />
            <Route path="user-management" element={<UserManagement />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;