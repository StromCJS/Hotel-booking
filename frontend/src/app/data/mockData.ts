// Mock data for the hotel booking system

export interface Room {
  id: string;
  roomNumber: string;
  type: 'Deluxe' | 'Suite' | 'Presidential' | 'Standard';
  price: number;
  status: 'Available' | 'Occupied' | 'Cleaning';
  images: string[];
  amenities: string[];
  description: string;
  maxGuests: number;
  beds: string;
  size: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  guestName: string;
  guestEmail: string;
  guests: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  password: string;
}

export const mockRooms: Room[] = [
  {
    id: '1',
    roomNumber: '101',
    type: 'Deluxe',
    price: 250,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzcwMDcwODY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Room Service', 'Air Conditioning'],
    description: 'Spacious deluxe room with modern amenities and stunning city views.',
    maxGuests: 2,
    beds: '1 King Bed',
    size: '350 sq ft'
  },
  {
    id: '2',
    roomNumber: '201',
    type: 'Suite',
    price: 450,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1725962479542-1be0a6b0d444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NzAwNzE4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Room Service', 'Air Conditioning', 'Bathtub', 'Living Area'],
    description: 'Luxurious suite featuring separate living area and premium furnishings.',
    maxGuests: 4,
    beds: '1 King Bed + Sofa Bed',
    size: '650 sq ft'
  },
  {
    id: '3',
    roomNumber: '102',
    type: 'Deluxe',
    price: 250,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1509647924673-bbb53e22eeb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWx1eGUlMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzAxMDgwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Room Service', 'Air Conditioning'],
    description: 'Elegant deluxe room perfect for business or leisure travelers.',
    maxGuests: 2,
    beds: '1 Queen Bed',
    size: '340 sq ft'
  },
  {
    id: '4',
    roomNumber: '301',
    type: 'Presidential',
    price: 850,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1725962479542-1be0a6b0d444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NzAwNzE4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Room Service', 'Air Conditioning', 'Bathtub', 'Living Area', 'Kitchen', 'Balcony'],
    description: 'Ultimate luxury in our presidential suite with panoramic views and exclusive amenities.',
    maxGuests: 6,
    beds: '2 King Beds + Sofa Bed',
    size: '1200 sq ft'
  },
  {
    id: '5',
    roomNumber: '103',
    type: 'Standard',
    price: 150,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzcwMDcwODY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning'],
    description: 'Comfortable standard room with essential amenities at an affordable price.',
    maxGuests: 2,
    beds: '2 Twin Beds',
    size: '280 sq ft'
  },
  {
    id: '6',
    roomNumber: '202',
    type: 'Suite',
    price: 450,
    status: 'Occupied',
    images: [
      'https://images.unsplash.com/photo-1725962479542-1be0a6b0d444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NzAwNzE4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Room Service', 'Air Conditioning', 'Bathtub', 'Living Area'],
    description: 'Premium suite with exceptional comfort and style.',
    maxGuests: 4,
    beds: '1 King Bed + Sofa Bed',
    size: '650 sq ft'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'B001',
    userId: 'U001',
    roomId: '6',
    checkInDate: '2026-02-10',
    checkOutDate: '2026-02-15',
    totalPrice: 2250,
    paymentStatus: 'Paid',
    guestName: 'John Smith',
    guestEmail: 'john@example.com',
    guests: 2
  },
  {
    id: 'B002',
    userId: 'U002',
    roomId: '1',
    checkInDate: '2026-02-08',
    checkOutDate: '2026-02-12',
    totalPrice: 1000,
    paymentStatus: 'Pending',
    guestName: 'Jane Doe',
    guestEmail: 'jane@example.com',
    guests: 1
  }
];

export const mockUsers: User[] = [
  {
    id: 'U001',
    name: 'Admin User',
    email: 'admin@luxestay.com',
    phone: '+1 (555) 000-0001',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: 'U002',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    role: 'customer',
    password: 'customer123'
  }
];
