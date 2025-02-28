import React, { useState } from 'react';
import { Menu, X, Home, Book, Users, ClipboardList, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/qatrat-7ayat-logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate(); 

  const menuItems = [
    { path:"/", title: "الرئيسية", icon: <Home className="w-5 h-5" /> },
    { path:"/all-articles", title: "المقالات", icon: <Book className="w-5 h-5" /> },
    { path:"/all-blood-donors", title: "المتبرعين", icon: <Users className="w-5 h-5" /> },
    { path:"/all-blood-requests", title: "الطلبات", icon: <ClipboardList className="w-5 h-5" /> }
  ];

  return (
    <nav dir="rtl" className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="logo" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="mr-2 text-xl font-cairo font-bold text-neutral-800">قطرة حياة</span>
            </div>
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
            
            <div className={`hidden md:flex items-center ${isSearchOpen ? 'w-64' : 'w-48'} transition-all duration-300`}>
              <input
                type="text"
                placeholder="ابحث..."
                className="w-full px-4 py-2 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 font-kufi text-sm"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
              <Search className="w-5 h-5 text-neutral-400 -mr-8" />
            </div>

            
            <button className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200">
              <Bell className="w-6 h-6 text-neutral-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>

             
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-neutral-50 rounded-full transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white border-t`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.title}
              className="flex items-center space-x-3 space-x-reverse w-full px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors duration-200 font-kufi"
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
          
          <div className="px-3 py-2">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="ابحث..."
                className="w-full px-4 py-2 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 font-kufi text-sm"
              />
              <Search className="w-5 h-5 text-neutral-400 -mr-8" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;