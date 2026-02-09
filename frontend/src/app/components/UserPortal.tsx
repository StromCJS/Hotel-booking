import React, { useState } from 'react';
import { HeroSection } from '@/app/components/HeroSection';
import { RoomListing } from '@/app/components/RoomListing';
import { BookingFlow } from '@/app/components/BookingFlow';
import { Room } from '@/app/data/rooms';

export const UserPortal = () => {
  const [currentView, setCurrentView] = useState<'hero' | 'rooms' | 'booking'>('hero');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  const handleSearch = (params: { checkIn: string; checkOut: string; guests: number }) => {
    setSearchParams(params);
    setCurrentView('rooms');
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView('booking');
  };

  const handleBackToRooms = () => {
    setCurrentView('rooms');
    setSelectedRoom(null);
  };

  const handleBackToHero = () => {
    setCurrentView('hero');
    setSelectedRoom(null);
  };

  return (
    <>
      {currentView === 'hero' && <HeroSection onSearch={handleSearch} />}
      {currentView === 'rooms' && (
        <RoomListing
          searchParams={searchParams}
          onSelectRoom={handleSelectRoom}
          onBackToHero={handleBackToHero}
        />
      )}
      {currentView === 'booking' && selectedRoom && (
        <BookingFlow
          room={selectedRoom}
          searchParams={searchParams}
          onBack={handleBackToRooms}
        />
      )}
    </>
  );
};
