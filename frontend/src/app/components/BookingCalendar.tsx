import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarEvent {
  id: string;
  roomNumber: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock booking data
  const bookings: CalendarEvent[] = [
    {
      id: '1',
      roomNumber: '101',
      guestName: 'John Smith',
      checkIn: new Date(2026, 1, 5),
      checkOut: new Date(2026, 1, 8),
      status: 'confirmed'
    },
    {
      id: '2',
      roomNumber: '201',
      guestName: 'Emma Wilson',
      checkOut: new Date(2026, 1, 10),
      checkIn: new Date(2026, 1, 6),
      status: 'confirmed'
    },
    {
      id: '3',
      roomNumber: '301',
      guestName: 'Michael Chen',
      checkIn: new Date(2026, 1, 7),
      checkOut: new Date(2026, 1, 12),
      status: 'pending'
    },
    {
      id: '4',
      roomNumber: '102',
      guestName: 'Sarah Johnson',
      checkIn: new Date(2026, 1, 10),
      checkOut: new Date(2026, 1, 15),
      status: 'confirmed'
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isDateBooked = (day: number, status: 'confirmed' | 'pending') => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return bookings.some(booking => {
      if (booking.status !== status) return false;
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return date >= checkIn && date <= checkOut;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl mb-1">
          Booking Calendar
        </h1>
        <p className="text-muted-foreground">View and manage all room bookings</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary"></div>
          <span className="text-sm">Booked (Confirmed)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary"></div>
          <span className="text-sm">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-background border-2 border-border"></div>
          <span className="text-sm">Available</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-primary text-primary-foreground p-6 flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isToday = 
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
              const isConfirmedBooking = isDateBooked(day, 'confirmed');
              const isPendingBooking = isDateBooked(day, 'pending');

              return (
                <div
                  key={day}
                  className={`aspect-square p-2 border-2 rounded-lg transition-all cursor-pointer hover:shadow-md ${
                    isToday
                      ? 'border-secondary bg-secondary/10'
                      : isConfirmedBooking
                      ? 'bg-primary text-primary-foreground border-primary'
                      : isPendingBooking
                      ? 'bg-secondary text-secondary-foreground border-secondary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="text-sm font-medium">{day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Bookings List */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Upcoming Bookings
        </h2>
        <div className="space-y-3">
          {bookings
            .filter(b => b.checkIn >= new Date())
            .sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime())
            .map(booking => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{booking.guestName}</span>
                    <span className="text-sm text-muted-foreground">Room {booking.roomNumber}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary/20 text-secondary-foreground'
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
