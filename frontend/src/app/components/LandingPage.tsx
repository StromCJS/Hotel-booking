import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Star, Wifi, Coffee, Dumbbell, Sparkles } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface LandingPageProps {
  onSearchRooms: (searchData: { checkIn: string; checkOut: string; guests: number }) => void;
}

export function LandingPage({ onSearchRooms }: LandingPageProps) {
  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchRooms(searchData);
  };

  const features = [
    { icon: Wifi, title: 'Free Wi-Fi', desc: 'High-speed internet' },
    { icon: Coffee, title: 'Breakfast', desc: 'Complimentary daily' },
    { icon: Dumbbell, title: 'Fitness Center', desc: '24/7 access' },
    { icon: Sparkles, title: 'Spa Services', desc: 'Luxury treatments' }
  ];

  const testimonials = [
    { name: 'Sarah Mitchell', rating: 5, text: 'Absolutely stunning property with exceptional service. The attention to detail is remarkable.' },
    { name: 'James Anderson', rating: 5, text: 'Best hotel experience I\'ve had. The rooms are immaculate and the staff is incredibly friendly.' },
    { name: 'Emily Chen', rating: 5, text: 'A perfect blend of luxury and comfort. Will definitely be coming back!' }
  ];

  return (
    <div className="bg-[#F9FAF9]">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGludGVyaW9yJTIwbG9iYnl8ZW58MXx8fHwxNzcwMTA4MDM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury Hotel Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A2517] opacity-40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-[700] text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Experience Luxury Living
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover unparalleled comfort and elegance in the heart of the city
            </p>
          </div>

          {/* Search Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#ACC8A2]/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Check-in Date */}
                  <div>
                    <label className="block text-[#1A2517] mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Check-in</span>
                    </label>
                    <input
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-[#1A2517]/20 focus:border-[#1A2517] outline-none transition-all bg-white text-[#1A2517]"
                      required
                    />
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <label className="block text-[#1A2517] mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Check-out</span>
                    </label>
                    <input
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-[#1A2517]/20 focus:border-[#1A2517] outline-none transition-all bg-white text-[#1A2517]"
                      required
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-[#1A2517] mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>Guests</span>
                    </label>
                    <select
                      value={searchData.guests}
                      onChange={(e) => setSearchData({ ...searchData, guests: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-[#1A2517]/20 focus:border-[#1A2517] outline-none transition-all bg-white text-[#1A2517]"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <AnimatedButton variant="primary" type="submit" className="w-full md:w-auto px-12">
                  <Search className="w-5 h-5 inline mr-2" />
                  Find Rooms
                </AnimatedButton>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-[600] text-[#1A2517] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Premium Amenities
            </h2>
            <p className="text-[#5a6158] max-w-2xl mx-auto">
              Experience world-class facilities designed for your comfort and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="text-center p-6 rounded-xl hover:bg-[#ACC8A2]/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ACC8A2] rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-[#1A2517]" />
                  </div>
                  <h3 className="text-xl font-[500] text-[#1A2517] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-[#5a6158]">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-[#F9FAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-[600] text-[#1A2517] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Guest Experiences
            </h2>
            <p className="text-[#5a6158] max-w-2xl mx-auto">
              Hear what our valued guests have to say about their stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#ACC8A2]/20 hover:border-[#ACC8A2] transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#ACC8A2] text-[#ACC8A2]" />
                  ))}
                </div>
                <p className="text-[#5a6158] mb-4 italic">"{testimonial.text}"</p>
                <p className="font-[500] text-[#1A2517]">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#1A2517] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-[600] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to Book Your Stay?
          </h2>
          <p className="text-lg text-[#ACC8A2] mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied guests who have experienced the perfect blend of luxury and comfort
          </p>
          <AnimatedButton 
            variant="secondary" 
            onClick={() => onSearchRooms(searchData)}
            className="mx-auto"
          >
            Explore Rooms
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
}
