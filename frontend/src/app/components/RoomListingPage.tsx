import React, { useState, useMemo } from 'react';
import { Wifi, Tv, Coffee, Wind, Bath, Users, Bed, Maximize, Check } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';
import { Room } from '@/app/data/mockData';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface RoomListingPageProps {
  rooms: Room[];
  searchData?: { checkIn: string; checkOut: string; guests: number };
  onBookRoom: (room: Room) => void;
}

export function RoomListingPage({ rooms, searchData, onBookRoom }: RoomListingPageProps) {
  const [filterType, setFilterType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'type'>('price-asc');

  // Amenity icon mapping
  const amenityIcons: Record<string, any> = {
    'Wi-Fi': Wifi,
    'TV': Tv,
    'Mini Bar': Coffee,
    'Air Conditioning': Wind,
    'Bathtub': Bath,
    'Room Service': Coffee,
  };

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let filtered = rooms.filter(room => room.status === 'Available');
    
    // Filter by type
    if (filterType !== 'All') {
      filtered = filtered.filter(room => room.type === filterType);
    }

    // Filter by guest count if search data provided
    if (searchData?.guests) {
      filtered = filtered.filter(room => room.maxGuests >= searchData.guests);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.type.localeCompare(b.type);
    });

    return filtered;
  }, [rooms, filterType, sortBy, searchData]);

  const roomTypes = ['All', 'Standard', 'Deluxe', 'Suite', 'Presidential'];

  return (
    <div className="min-h-screen bg-[#F9FAF9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-[700] text-[#1A2517] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Available Rooms
          </h1>
          {searchData && (
            <div className="bg-[#ACC8A2]/20 rounded-lg px-4 py-3 inline-block">
              <p className="text-[#1A2517]">
                <span className="font-[500]">Check-in:</span> {searchData.checkIn} • 
                <span className="font-[500] ml-2">Check-out:</span> {searchData.checkOut} • 
                <span className="font-[500] ml-2">Guests:</span> {searchData.guests}
              </p>
            </div>
          )}
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-md border border-[#ACC8A2]/20">
          {/* Room Type Filter */}
          <div>
            <label className="block text-[#1A2517] mb-2 font-[500]">Filter by Room Type</label>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    filterType === type
                      ? 'bg-[#1A2517] text-[#F9FAF9]'
                      : 'bg-[#ACC8A2]/20 text-[#1A2517] hover:bg-[#ACC8A2]/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[#1A2517] mb-2 font-[500]">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg border-2 border-[#ACC8A2]/40 focus:border-[#1A2517] outline-none bg-white text-[#1A2517]"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="type">Room Type</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[#5a6158]">
            Showing <span className="font-[500] text-[#1A2517]">{filteredRooms.length}</span> available rooms
          </p>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map(room => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#ACC8A2] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
            >
              {/* Room Image */}
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={room.images[0]}
                  alt={`${room.type} Room`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-[#ACC8A2] px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-[#1A2517] font-[600]">
                    ${room.price}
                    <span className="text-sm font-[400]">/night</span>
                  </p>
                </div>
                {/* Room Type Badge */}
                <div className="absolute bottom-4 left-4 bg-[#1A2517] px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-[#F9FAF9] font-[500]">{room.type}</p>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-6">
                <h3 className="text-2xl font-[600] text-[#1A2517] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Room {room.roomNumber}
                </h3>
                <p className="text-[#5a6158] mb-4">{room.description}</p>

                {/* Room Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-[#1A2517]">
                    <Users className="w-4 h-4 text-[#ACC8A2]" />
                    <span>Up to {room.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1A2517]">
                    <Bed className="w-4 h-4 text-[#ACC8A2]" />
                    <span>{room.beds}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1A2517] col-span-2">
                    <Maximize className="w-4 h-4 text-[#ACC8A2]" />
                    <span>{room.size}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <p className="text-sm font-[500] text-[#1A2517] mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 5).map((amenity, idx) => {
                      const Icon = amenityIcons[amenity] || Check;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-1 text-xs bg-[#ACC8A2]/20 px-3 py-1 rounded-full text-[#1A2517]"
                        >
                          <Icon className="w-3 h-3" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                    {room.amenities.length > 5 && (
                      <div className="flex items-center text-xs bg-[#ACC8A2]/20 px-3 py-1 rounded-full text-[#1A2517]">
                        +{room.amenities.length - 5} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Button */}
                <AnimatedButton
                  variant="outline"
                  onClick={() => onBookRoom(room)}
                  className="w-full"
                >
                  Book Now
                </AnimatedButton>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ACC8A2]/20 rounded-full mb-4">
              <Bed className="w-10 h-10 text-[#1A2517]" />
            </div>
            <h3 className="text-2xl font-[600] text-[#1A2517] mb-2">No rooms available</h3>
            <p className="text-[#5a6158]">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
