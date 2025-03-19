import React, { useState } from "react";
import {
  Home,
  Users,
  FileText,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Tag,
  ShieldCheck,
} from "lucide-react";
import logo from '../../../assets/images/qatrat-7ayat-logo.jpg';


const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { link: "/admin/dashboard", title: "Dashboard", icon: Home },
    { link: "article-management", title: "Articles", icon: FileText }, 
    { link: "tag-management", title: "Tags", icon: Tag }, 
    { link: "user-management", title: "Users", icon: Users }, 
    { link: "role-management", title: "Roles", icon: ShieldCheck }, 
    { link: "notifications", title: "Notifications", icon: Bell }, 
    { link: "settings", title: "Settings", icon: Settings }, 
  ];

  return (
    <div
      className={`bg-white min-h-screen border-r border-neutral-100 text-neutral-800 transition-all duration-300 ${isExpanded ? "w-64" : "w-20"
        }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-neutral-100">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-bold text-2xl font-cairo text-primary-500">
              BloodLife
            </span>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-600 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.title}
            href={item.link}
            className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-primary-50 text-neutral-600 hover:text-primary-500 transition-colors ${!isExpanded && "justify-center"
              }`}
          >
            <item.icon className="h-5 w-5" />
            {isExpanded && <span className="font-cairo">{item.title}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
