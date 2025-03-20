import React, { useState } from "react";
import { Search, User, ChevronDown, Home } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const AdminLayout = ({ children }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  console.log("useruseruser ", user);
  return (
    <div className="flex h-screen bg-neutral-50">
      <aside>
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-neutral-100">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-primary-500 font-cairo"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 hover:bg-neutral-50 rounded-lg"
                >
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-500" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold font-cairo">
                      {user?.email || "Admin Name"}
                    </p>
                    <p className="text-xs text-neutral-500">
                    {user?.roles || "No roles"}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-2 z-50">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-neutral-50 font-cairo"
                    >
                      Profile Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-neutral-50 font-cairo"
                    >
                      Account Settings
                    </a>
                    <div className="border-t border-neutral-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-44 px-4 py-2 text-sm text-primary-500 hover:bg-neutral-50 font-cairo"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;