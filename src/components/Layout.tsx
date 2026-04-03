import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { MapPin, Activity, FileText, MessageSquare, LogOut, Droplets, AlertTriangle, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Hospitals', icon: MapPin },
    { path: '/emergency', label: 'Emergency', icon: AlertTriangle, isDanger: true },
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/blood-bank', label: 'Blood Bank', icon: Droplets },
    { path: '/history', label: 'History', icon: FileText },
    { path: '/assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-neutral-50/50 text-neutral-900 font-sans overflow-hidden selection:bg-emerald-200">
      
      {/* Desktop Sidebar (Floating Island Style) */}
      <aside className="hidden md:flex flex-col w-72 p-4">
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 overflow-hidden">
          <div className="p-6 flex items-center gap-3 border-b border-neutral-100/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-800 font-display">HealthConnect</h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? item.isDanger 
                        ? 'bg-red-50 text-red-700 font-semibold' 
                        : 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab" 
                        className={`absolute inset-0 opacity-10 ${item.isDanger ? 'bg-red-500' : 'bg-emerald-500'}`}
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-neutral-100/50 bg-neutral-50/50">
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-neutral-800 font-display">HealthConnect</h1>
        </div>
        <button onClick={onLogout} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-24 md:pb-0 relative">
        <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav (Glassmorphism) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-neutral-200/50 pb-[env(safe-area-inset-bottom)] z-30">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
                  isActive 
                    ? item.isDanger ? 'text-red-600' : 'text-emerald-600' 
                    : 'text-neutral-400 hover:text-neutral-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="mobileActiveTab" 
                      className={`absolute top-0 w-8 h-1 rounded-b-full ${item.isDanger ? 'bg-red-600' : 'bg-emerald-600'}`}
                    />
                  )}
                  <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
