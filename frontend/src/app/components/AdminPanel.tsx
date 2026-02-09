import React, { useState } from 'react';
import { Dashboard } from '@/app/components/Dashboard';
import { RoomManagement } from '@/app/components/RoomManagement';
import { BookingCalendar } from '@/app/components/BookingCalendar';
import {
  LayoutDashboard,
  Hotel,
  Calendar,
  LogOut,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export const AdminPanel = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'rooms' | 'calendar'>('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'rooms', label: 'Room Management', icon: Hotel },
    { key: 'calendar', label: 'Booking Calendar', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-0'
          } bg-sidebar text-sidebar-foreground transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl">
            Serenity
          </h1>
          <p className="text-sm text-sidebar-foreground/70">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-sm text-sidebar-foreground/70 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-xl font-medium">
              {menuItems.find(item => item.key === currentView)?.label}
            </h2>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'rooms' && <RoomManagement />}
          {currentView === 'calendar' && <BookingCalendar />}
        </main>
      </div>
    </div>
  );
};
