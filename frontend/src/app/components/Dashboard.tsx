import React from 'react';
import { rooms } from '@/app/data/rooms';
import { DollarSign, Hotel, TrendingUp, Users, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  // Calculate stats
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const occupancyRate = ((occupiedRooms / totalRooms) * 100).toFixed(1);
  
  // Mock revenue data
  const totalRevenue = 125430;
  const monthlyRevenue = 42850;
  const averageRate = 375;

  // Recent bookings (mock data)
  const recentBookings = [
    { id: '1', guest: 'John Smith', room: '101', checkIn: '2026-02-05', status: 'Confirmed' },
    { id: '2', guest: 'Emma Wilson', room: '201', checkIn: '2026-02-06', status: 'Confirmed' },
    { id: '3', guest: 'Michael Chen', room: '301', checkIn: '2026-02-07', status: 'Pending' },
    { id: '4', guest: 'Sarah Johnson', room: '102', checkIn: '2026-02-08', status: 'Confirmed' },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'border-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      change: '+5.2%',
      icon: TrendingUp,
      color: 'border-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'Available Rooms',
      value: availableRooms.toString(),
      change: `${totalRooms} total`,
      icon: Hotel,
      color: 'border-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'Total Bookings',
      value: '156',
      change: '+8 today',
      icon: Users,
      color: 'border-chart-4',
      bgColor: 'bg-chart-4/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary/50 rounded-xl p-8 text-white">
        <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-4xl mb-2">
          Welcome back!
        </h1>
        <p className="text-white/90">Here's what's happening with your hotel today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-card rounded-xl p-6 border-2 ${stat.color} hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-medium mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-medium mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{booking.guest}</p>
                  <p className="text-sm text-muted-foreground">
                    Room {booking.room} • {new Date(booking.checkIn).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Confirmed'
                      ? 'bg-secondary/20 text-secondary-foreground'
                      : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Status Overview */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-medium mb-4">Room Status</h2>
          <div className="space-y-4">
            {/* Occupancy Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Occupancy</span>
                <span className="text-sm font-medium">{occupancyRate}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-500"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-secondary/10 rounded-lg">
                <div className="text-2xl font-medium">{availableRooms}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-medium">{occupiedRooms}</div>
                <div className="text-sm text-muted-foreground">Occupied</div>
              </div>
              <div className="text-center p-4 bg-muted-foreground/10 rounded-lg">
                <div className="text-2xl font-medium">
                  {rooms.filter(r => r.status === 'Cleaning').length}
                </div>
                <div className="text-sm text-muted-foreground">Cleaning</div>
              </div>
            </div>

            {/* Alerts */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">2 rooms need attention</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Room 202 is being cleaned. Room 102 checkout today at 11 AM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-medium mb-4">Revenue Overview</h2>
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">Monthly revenue: ${monthlyRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
