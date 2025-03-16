import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Book,
  Users,
  ClipboardList,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/qatrat-7ayat-logo.jpg";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const isAdmin = user && user.roles && user.roles.includes("ROLE_ADMIN");

  useEffect(() => {}, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-16 bg-white shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

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

  if (isAdmin) {
    menuItems.push({
      path: "/admin/dashboard",
      title: "لوحة التحكم",
      icon: <LayoutDashboard className="w-5 h-5" />,
    });
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    if (user && user.id) {
      navigate(`/profile`);
    } else {
      console.error("User ID is not available");
      navigate("/login");
    }
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
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 transition-colors duration-200 font-kufi ${
                  item.path.includes("admin")
                    ? "text-neutral-600 hover:text-primary-500"
                    : "text-neutral-600 hover:text-primary-500"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200"
                >
                  <User className="w-6 h-6 text-neutral-600" />
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-kufi text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-kufi text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                >
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-kufi text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>إنشاء حساب</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200"
              aria-label={isOpen ? "Close menu" : "Open menu"}
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

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`flex items-center space-x-2 space-x-reverse w-full px-4 py-3 text-right hover:bg-neutral-50 transition-colors duration-200 ${
                item.path.includes("admin")
                  ? "text-purple-600"
                  : "text-neutral-600"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
