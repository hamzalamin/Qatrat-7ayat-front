import React, { useState } from "react";
import { Bell, Search, User, ChevronDown, Home } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
              <a
                href="/"
                key="homePage"
                className="hover:bg-neutral-50 rounded-lg relative"
              >
                <Home className="h-5 w-5 text-neutral-600" />
              </a>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-neutral-50 rounded-lg relative"
                >
                  <Bell className="h-5 w-5 text-neutral-600" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-primary-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <h3 className="font-cairo font-semibold">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-neutral-50 cursor-pointer">
                        <p className="text-sm font-cairo">
                          New donor registration request
                        </p>
                        <p className="text-xs text-neutral-500">
                          2 minutes ago
                        </p>
                      </div>
                      <div className="px-4 py-3 hover:bg-neutral-50 cursor-pointer">
                        <p className="text-sm font-cairo">
                          Blood inventory alert: A+ running low
                        </p>
                        <p className="text-xs text-neutral-500">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
                      Admin Name
                    </p>
                    <p className="text-xs text-neutral-500">Super Admin</p>
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
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-primary-500 hover:bg-neutral-50 font-cairo"
                    >
                      Logout
                    </a>
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
