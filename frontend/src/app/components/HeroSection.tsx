import React, { useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { AnimatedButton } from '@/app/components/AnimatedButton';
import { Calendar, Users, Search, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

interface HeroSectionProps {
  onSearch: (params: { checkIn: string; checkOut: string; guests: number }) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkIn && checkOut) {
      onSearch({ checkIn, checkOut, guests });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcwMDI2MzkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury Hotel Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1A2517]/40"></div>
      </div>

      {/* Header Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 md:px-12">
        <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-4xl text-white">
          Serenity
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="text-white">
            Welcome, <span className="font-medium">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] px-6">
        <div className="text-center mb-12 text-white">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-6xl md:text-7xl mb-4">
            Escape to Luxury
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            Experience unparalleled comfort and elegance in our carefully curated rooms
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-4xl bg-[#ACC8A2]/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Check-in */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#1A2517] font-medium">
                  <Calendar className="w-5 h-5" />
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#1A2517]/20 focus:border-[#1A2517] focus:outline-none transition-colors bg-white text-[#1A2517]"
                  required
                />
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#1A2517] font-medium">
                  <Calendar className="w-5 h-5" />
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#1A2517]/20 focus:border-[#1A2517] focus:outline-none transition-colors bg-white text-[#1A2517]"
                  required
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#1A2517] font-medium">
                  <Users className="w-5 h-5" />
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#1A2517]/20 focus:border-[#1A2517] focus:outline-none transition-colors bg-white text-[#1A2517]"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <AnimatedButton
              type="submit"
              variant="primary"
              className="w-full md:w-auto px-12 flex items-center justify-center gap-2 mx-auto"
            >
              <Search className="w-5 h-5" />
              Find Rooms
            </AnimatedButton>
          </form>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl w-full text-white">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-3xl">🏨</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl mb-2">Premium Rooms</h3>
            <p className="text-white/80">Luxuriously appointed rooms and suites</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl mb-2">Fine Dining</h3>
            <p className="text-white/80">World-class restaurants and bars</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-3xl">💆</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl mb-2">Spa & Wellness</h3>
            <p className="text-white/80">Rejuvenate in our luxury spa</p>
          </div>
        </div>
      </div>
    </div>
  );
};
