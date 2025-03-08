import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Book,
  Users,
  ClipboardList,
  Bell,
  Search,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/qatrat-7ayat-logo.jpg";
import AuthService from "../../../services/authService";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", title: "الرئيسية", icon: <Home className="w-5 h-5" /> },
    {
      path: "/all-articles",
      title: "المقالات",
      icon: <Book className="w-5 h-5" />,
    },
    {
      path: "/all-blood-donors",
      title: "المتبرعين",
      icon: <Users className="w-5 h-5" />,
    },
    {
      path: "/all-blood-requests",
      title: "الطلبات",
      icon: <ClipboardList className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = AuthService.isAuthenticated();
      setIsLoggedIn(loggedIn);
    };
  
    checkAuth();
    window.addEventListener('authChange', checkAuth);
  
    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav dir="rtl" className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="mr-2 text-xl font-cairo font-bold text-neutral-800">
              قطرة حياة
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-kufi"
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            {isLoggedIn ? (
              <>
                {/* Profile */}
                <button
                  onClick={() => {
                    const user = AuthService.getCurrentUser(); 
                    if (user && user.id) {
                      navigate(`/profile/${user.id}`);
                    }
                  }}
                  className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200"
                >
                  <User className="w-6 h-6 text-neutral-600" />
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-kufi text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-kufi text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                >
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </button>

                {/* Register */}
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-kufi text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>إنشاء حساب</span>
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="block px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
            >
              {item.icon}
              {item.title}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
