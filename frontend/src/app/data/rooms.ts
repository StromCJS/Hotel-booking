export interface Room {
  id: string;
  roomNumber: string;
  type: 'Deluxe' | 'Suite' | 'Executive' | 'Presidential';
  price: number;
  status: 'Available' | 'Occupied' | 'Cleaning';
  images: string[];
  amenities: string[];
  description: string;
  capacity: number;
  size: string;
}

export const rooms: Room[] = [
  {
    id: '1',
    roomNumber: '101',
    type: 'Deluxe',
    price: 250,
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWx1eGUlMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzcwMTA4NDcwfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar', 'Room Service'],
    description: 'Experience comfort and elegance in our Deluxe Room, featuring modern amenities and stunning city views.',
    capacity: 2,
    size: '35 m²'
  },
  {
    id: '2',
    roomNumber: '201',
    type: 'Suite',
    price: 450,
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1758448511255-ac2a24a135d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGV4ZWN1dGl2ZSUyMHN1aXRlfGVufDF8fHx8MTc3MDEwODQ3MHww&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: ['King Bed', 'Ocean View', 'Free WiFi', 'Jacuzzi', 'Private Balcony', 'Butler Service'],
    description: 'Indulge in luxury with our Suite, offering spacious living areas and breathtaking ocean views.',
    capacity: 3,
    size: '55 m²'
  },
  {
    id: '3',
    roomNumber: '301',
    type: 'Executive',
    price: 350,
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1664780476492-fbb9fd277ce8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzaWRlbnRpYWwlMjBzdWl0ZSUyMGx1eHVyeXxlbnwxfHx8fDE3NzAwMzkwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: ['King Bed', 'Work Desk', 'Free WiFi', 'Lounge Access', 'Complimentary Breakfast'],
    description: 'Perfect for business travelers, our Executive Room combines comfort with productivity.',
    capacity: 2,
    size: '42 m²'
  },
  {
    id: '4',
    roomNumber: '401',
    type: 'Presidential',
    price: 850,
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcwMDI2MzkyfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: ['2 King Beds', 'Panoramic View', 'Free WiFi', 'Private Pool', 'Chef Service', 'Spa Access', 'Helipad Access'],
    description: 'The ultimate in luxury living, our Presidential Suite offers unparalleled elegance and service.',
    capacity: 4,
    size: '120 m²'
  },
  {
    id: '5',
    roomNumber: '102',
    type: 'Deluxe',
    price: 250,
    status: 'Occupied',
    images: ['https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWx1eGUlMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzcwMTA4NDcwfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: ['King Bed', 'Garden View', 'Free WiFi', 'Mini Bar', 'Room Service'],
    description: 'Experience comfort and elegance in our Deluxe Room with serene garden views.',
    capacity: 2,
    size: '35 m²'
  },
  {
    id: '6',
    roomNumber: '202',
    type: 'Suite',
    price: 450,
    status: 'Cleaning',
    images: ['https://images.unsplash.com/photo-1758448511255-ac2a24a135d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGV4ZWN1dGl2ZSUyMHN1aXRlfGVufDF8fHx8MTc3MDEwODQ3MHww&ixlib=rb-4.1.0&q=80&w=1080'],
    amenities: ['King Bed', 'Mountain View', 'Free WiFi', 'Jacuzzi', 'Private Balcony', 'Butler Service'],
    description: 'Relax in our Suite with stunning mountain views and premium amenities.',
    capacity: 3,
    size: '55 m²'
  }
];

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  paymentStatus: 'Pending' | 'Confirmed' | 'Cancelled';
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guests: number;
}
