import React from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { AnimatedButton } from '@/app/components/AnimatedButton';
import { rooms, Room } from '@/app/data/rooms';
import { ArrowLeft, Users, Maximize2, Wifi, Coffee, Tv, Wind } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

interface RoomListingProps {
  searchParams: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  onSelectRoom: (room: Room) => void;
  onBackToHero: () => void;
}

export const RoomListing = ({ searchParams, onSelectRoom, onBackToHero }: RoomListingProps) => {
  const { logout } = useAuth();
  const availableRooms = rooms.filter(room => 
    room.status === 'Available' && room.capacity >= searchParams.guests
  );

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Free WiFi': <Wifi className="w-4 h-4" />,
    'Mini Bar': <Coffee className="w-4 h-4" />,
    'Room Service': <Tv className="w-4 h-4" />,
    'Default': <Wind className="w-4 h-4" />
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHero}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-primary">
              Serenity
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Search Summary */}
      <div className="bg-secondary/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Check-in:</span>{' '}
              <span className="font-medium">{new Date(searchParams.checkIn).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Check-out:</span>{' '}
              <span className="font-medium">{new Date(searchParams.checkOut).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Guests:</span>{' '}
              <span className="font-medium">{searchParams.guests}</span>
            </div>
            <div className="ml-auto">
              <span className="font-medium">{availableRooms.length} rooms available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {availableRooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No rooms available for your search criteria.</p>
            <AnimatedButton onClick={onBackToHero} className="mt-6">
              Modify Search
            </AnimatedButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableRooms.map((room) => (
              <div
                key={room.id}
                className="bg-card rounded-xl shadow-lg overflow-hidden border border-border group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                {/* Room Image */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={room.images[0]}
                    alt={`${room.type} Room`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-secondary/95 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-medium text-secondary-foreground">${room.price}/night</span>
                  </div>
                  {/* Room Type */}
                  <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-white font-medium">{room.type}</span>
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl mb-2">
                    {room.type} Room
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Room Info */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-4 h-4" />
                      <span>{room.size}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0, 4).map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs"
                        >
                          {amenityIcons[amenity] || amenityIcons['Default']}
                          <span>{amenity}</span>
                        </div>
                      ))}
                      {room.amenities.length > 4 && (
                        <div className="px-3 py-1 bg-muted rounded-full text-xs">
                          +{room.amenities.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Button */}
                  <AnimatedButton
                    onClick={() => onSelectRoom(room)}
                    variant="primary"
                    className="w-full"
                  >
                    Book Now
                  </AnimatedButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
