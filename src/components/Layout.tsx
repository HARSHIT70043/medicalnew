// src/components/Layout.tsx
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Activity, FileText, Brain, LogOut, User, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem('userName') || 'User';
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const navigation = [
    { name: 'Live Dashboard', path: '/', icon: Activity },
    { name: 'Medical History', path: '/history', icon: FileText },
    { name: 'AI Assistant', path: '/assistant', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <Heart className="w-8 h-8 text-red-500" fill="#ef4444" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LifeLine Live
              </span>
            </Link>

            {/* Navigation Links - Center (with flex-1 to push content) */}
            <div className="hidden md:flex flex-1 items-center justify-center space-x-1 mx-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* User Menu - Right */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <span className="hidden md:block text-sm text-gray-600 whitespace-nowrap">
                Welcome, <span className="font-semibold text-blue-600">{userName}</span>
              </span>
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors flex-shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-3 gap-1 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-xl ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;