import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/Header/Navbar";
import Footer from "./components/layout/Footer/Footer";
import HeroSection from "./pages/Home/Hero";
import BloodRequestsSection from "./pages/BloodRequest/BloodRequests";
import BloodType from "./pages/Home/BloodType";
import LatestArticles from "./pages/Artcle/LatestArticle";
import DonationProcessSection from "./pages/Home/DonationProcess";
import LoginPage from "./pages/Auth/login/Login";
import RegistrationForm from "./pages/Auth/Register/Register";
import AllBloodRequests from "./pages/BloodRequest/AllBloodRequests";
import AllBloodDonors from "./pages/BloodDonor/AllBloodDonors";
import AllArticles from "./pages/Artcle/AllArticles";
import ArticleDetail from "./pages/Artcle/ArticleDetail";
import ProtectedRoute from "./ProtectedRoute";
import UserProfile from "./pages/Auth/profile";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminStatistics from "./pages/Admin/AdminStatistic";
import ArticleManagement from "./pages/Admin/ArticleManagment";
import UserManagement from "./pages/Admin/UsersManagment";
import TagManagement from "./pages/Admin/TagsManagment";
import { AuthProvider } from "./context/AuthContext";
import Error401 from "./components/layout/Exceptions/Error401";
import Error403 from "./components/layout/Exceptions/Error403";
import Error404 from "./components/layout/Exceptions/Error404";
import RoleManagement from "./pages/Admin/RoleManagement";
import GlobalError from "./components/layout/Exceptions/GlobalErrorHandler";
import { ErrorProvider } from "./context/ErrorContext";
import BloodDonorsSection from "./pages/BloodDonor/BloodDonors";
import LiveChatNotification from "./components/layout/chat/LiveChatNotification";
import ChatPage from "./components/layout/chat/Chat";

function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <GlobalError />
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

const Unauthorized = () => {
  return <Error401 />;
};

const Forbidden = () => {
  return <Error403 />;
};

const NotFound = () => {
  return <Error404 />;
};

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <HeroSection />
                    <BloodRequestsSection />
                    <BloodDonorsSection />
                    <BloodType />
                    <LatestArticles />
                    <DonationProcessSection />
                    <LiveChatNotification />
                  </>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/all-blood-requests" element={<AllBloodRequests />} />
              <Route path="/all-blood-donors" element={<AllBloodDonors />} />
              <Route path="/all-articles" element={<AllArticles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/messaging" element={<ChatPage />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_COORDINATOR"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminStatistics />} />
                <Route path="article-management" element={<ArticleManagement />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="tag-management" element={<TagManagement />} />
                <Route path="role-management" element={<RoleManagement />} />
              </Route>
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
