// components/Layout.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Bell, FileText, Settings, LifeBuoy } from 'lucide-react';
import UserMenu from './UserMenu'; // Create this as a separate component
import Clock from './../assests/clock.png'
import Logo from './../assests/famicons_logo-slack (1).png'
import ReportsIcon from './../assests/report.png';
import DashboardIcon from './../assests/chart-pie.png';
import SupportIcon from './../assests/chat-bubble-left-right.png';
import SettingIcon from './../assests/cog-six-tooth.png'


const AppLayout = ({ children, onLogout }) => {
  const location = useLocation();


   // Dynamic icons or elements based on the route
   const routeDetails = {
    '/dashboard': {
      icon: DashboardIcon,
      title: 'Dashboard',
    },
    '/alerts': {
      icon: Clock,
      title: 'Alerts',
    },
    '/reports': {
      icon: ReportsIcon,
      title: 'Reports',
    },
    '/settings': {
      icon: SettingIcon, 
      title: 'Settings',
    },
    '/support': {
      icon: SupportIcon, 
      title: 'Support',
    }
    // Add other routes as needed
  };

  const currentRoute = routeDetails[location.pathname] || {
    icon: null,
    title: location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.slice(2),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r p-4">
        <div className="flex items-center gap-2 mb-8">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
          <div className="text-blue-600 font-bold">Cybedefender AI</div>
        </div>
        
        <nav className="space-y-2">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 p-2 rounded ${
              location.pathname === '/dashboard' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layout className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/alerts" 
            className={`flex items-center gap-2 p-2 rounded ${
              location.pathname === '/alerts' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell className="h-5 w-5" />
            <span>Alerts</span>
          </Link>
          
          {/* Add other navigation links */}
          <Link 
            to="/reports" 
            className={`flex items-center gap-2 p-2 rounded ${
              location.pathname === '/reports' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Reports</span>
          </Link>

          <Link 
            to="/settings" 
            className={`flex items-center gap-2 p-2 rounded ${
              location.pathname === '/settings' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <Link 
            to="/support" 
            className={`flex items-center gap-2 p-2 rounded ${
              location.pathname === '/support' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LifeBuoy className="h-5 w-5" />
            <span>Support</span>
          </Link>

        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            {currentRoute.icon && <img src={currentRoute.icon} alt="Route Icon" className="w-8 h-8" />}
            <h1 className="text-2xl font-bold">{currentRoute.title}</h1>
          </div>
          <UserMenu onLogout={onLogout} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;