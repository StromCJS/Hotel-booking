import React from 'react';
import { Hotel, Menu, X, User, LogOut } from 'lucide-react';

interface NavigationProps {
  isAuthenticated: boolean;
  userRole?: 'customer' | 'admin';
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Navigation({ isAuthenticated, userRole, onNavigate, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#1A2517] border-b border-[rgba(172,200,162,0.2)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 group"
          >
            <div className="bg-[#ACC8A2] p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Hotel className="w-6 h-6 text-[#1A2517]" />
            </div>
            <span className="text-xl font-[600] text-[#F9FAF9]" style={{ fontFamily: 'var(--font-heading)' }}>
              LuxeStay
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('home')}
              className="text-[#ACC8A2] hover:text-[#F9FAF9] transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('rooms')}
              className="text-[#ACC8A2] hover:text-[#F9FAF9] transition-colors"
            >
              Rooms
            </button>
            {isAuthenticated && userRole === 'admin' && (
              <button 
                onClick={() => onNavigate('admin')}
                className="text-[#ACC8A2] hover:text-[#F9FAF9] transition-colors"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 text-[#ACC8A2] hover:text-[#F9FAF9] transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#2D3D28] text-[#ACC8A2] rounded-lg hover:bg-[#ACC8A2] hover:text-[#1A2517] transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-[#ACC8A2] hover:text-[#F9FAF9] transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 bg-[#ACC8A2] text-[#1A2517] rounded-lg hover:bg-[#C4D9BB] transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#ACC8A2] hover:text-[#F9FAF9]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(172,200,162,0.2)]">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
                className="text-[#ACC8A2] hover:text-[#F9FAF9] text-left"
              >
                Home
              </button>
              <button 
                onClick={() => { onNavigate('rooms'); setIsMobileMenuOpen(false); }}
                className="text-[#ACC8A2] hover:text-[#F9FAF9] text-left"
              >
                Rooms
              </button>
              {isAuthenticated && userRole === 'admin' && (
                <button 
                  onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
                  className="text-[#ACC8A2] hover:text-[#F9FAF9] text-left"
                >
                  Dashboard
                </button>
              )}
              <div className="pt-4 border-t border-[rgba(172,200,162,0.2)]">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => { onNavigate('profile'); setIsMobileMenuOpen(false); }}
                      className="text-[#ACC8A2] hover:text-[#F9FAF9] mb-4 w-full text-left"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full px-4 py-2 bg-[#2D3D28] text-[#ACC8A2] rounded-lg hover:bg-[#ACC8A2] hover:text-[#1A2517] transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                      className="text-[#ACC8A2] hover:text-[#F9FAF9] mb-4 w-full text-left"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => { onNavigate('register'); setIsMobileMenuOpen(false); }}
                      className="w-full px-4 py-2 bg-[#ACC8A2] text-[#1A2517] rounded-lg hover:bg-[#C4D9BB] transition-all"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
