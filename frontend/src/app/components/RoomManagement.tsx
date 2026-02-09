import React, { useState } from 'react';
import { rooms as initialRooms, Room } from '@/app/data/rooms';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { AnimatedButton } from '@/app/components/AnimatedButton';

export const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Available' | 'Occupied' | 'Cleaning'>('All');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.includes(searchTerm) || 
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-secondary/20 text-secondary-foreground border-secondary';
      case 'Occupied':
        return 'bg-destructive/20 text-destructive border-destructive';
      case 'Cleaning':
        return 'bg-muted-foreground/20 text-muted-foreground border-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleStatusChange = (roomId: string, newStatus: Room['status']) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, status: newStatus } : room
    ));
  };

  const handleDelete = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(room => room.id !== roomId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl mb-1">
            Room Management
          </h1>
          <p className="text-muted-foreground">Manage all hotel rooms and their status</p>
        </div>
        <AnimatedButton variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Room
        </AnimatedButton>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by room number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['All', 'Available', 'Occupied', 'Cleaning'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="px-6 py-4 text-left">Room #</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Price/Night</th>
                <th className="px-6 py-4 text-left">Capacity</th>
                <th className="px-6 py-4 text-left">Size</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room, index) => (
                <tr
                  key={room.id}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                  }`}
                >
                  <td className="px-6 py-4 font-medium">{room.roomNumber}</td>
                  <td className="px-6 py-4">{room.type}</td>
                  <td className="px-6 py-4">${room.price}</td>
                  <td className="px-6 py-4">{room.capacity} guests</td>
                  <td className="px-6 py-4">{room.size}</td>
                  <td className="px-6 py-4">
                    <select
                      value={room.status}
                      onChange={(e) => handleStatusChange(room.id, e.target.value as Room['status'])}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(room.status)}`}
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Cleaning">Cleaning</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary/20 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-2 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {filteredRooms.map((room) => (
            <div key={room.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">Room {room.roomNumber}</h3>
                  <p className="text-sm text-muted-foreground">{room.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <span className="ml-2 font-medium">${room.price}/night</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="ml-2 font-medium">{room.capacity} guests</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="ml-2 font-medium">{room.size}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-medium">{rooms.length}</div>
          <div className="text-sm text-muted-foreground">Total Rooms</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-medium text-secondary">
            {rooms.filter(r => r.status === 'Available').length}
          </div>
          <div className="text-sm text-muted-foreground">Available</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-medium text-destructive">
            {rooms.filter(r => r.status === 'Occupied').length}
          </div>
          <div className="text-sm text-muted-foreground">Occupied</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="text-2xl font-medium text-muted-foreground">
            {rooms.filter(r => r.status === 'Cleaning').length}
          </div>
          <div className="text-sm text-muted-foreground">Cleaning</div>
        </div>
      </div>
    </div>
  );
};
