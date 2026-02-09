"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        // Initialize database connection
        await (0, models_1.initializeDatabase)();
        // Create admin user
        const adminUser = await models_1.User.create({
            name: 'Admin User',
            email: 'admin@hotelbooking.com',
            password: 'admin123',
            role: 'admin',
            phone: '+1234567890',
            isActive: true,
        });
        console.log('✅ Admin user created:', adminUser.email);
        // Sample rooms data
        const roomsData = [
            // Deluxe Rooms
            {
                roomNumber: '101',
                type: 'Deluxe',
                price: 150.00,
                status: 'Available',
                capacity: 2,
                size: '350 sq ft',
                description: 'Comfortable deluxe room with city view, perfect for business travelers.',
                images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
                amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service'],
            },
            {
                roomNumber: '102',
                type: 'Deluxe',
                price: 150.00,
                status: 'Available',
                capacity: 2,
                size: '350 sq ft',
                description: 'Spacious deluxe room with modern amenities and comfortable bedding.',
                images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
                amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service'],
            },
            {
                roomNumber: '103',
                type: 'Deluxe',
                price: 160.00,
                status: 'Available',
                capacity: 2,
                size: '360 sq ft',
                description: 'Premium deluxe room with enhanced amenities and superior comfort.',
                images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
                amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service', 'Coffee Maker'],
            },
            // Suite Rooms
            {
                roomNumber: '201',
                type: 'Suite',
                price: 250.00,
                status: 'Available',
                capacity: 4,
                size: '650 sq ft',
                description: 'Luxurious suite with separate living area, perfect for families or extended stays.',
                images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
                amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service', 'Kitchenette', 'Balcony'],
            },
            {
                roomNumber: '202',
                type: 'Suite',
                price: 280.00,
                status: 'Available',
                capacity: 4,
                size: '700 sq ft',
                description: 'Executive suite with premium furnishings and panoramic city views.',
                images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
                amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service', 'Kitchenette', 'Balcony', 'Jacuzzi'],
            },
            // Executive Rooms
            {
                roomNumber: '301',
                type: 'Executive',
                price: 200.00,
                status: 'Available',
                capacity: 2,
                size: '450 sq ft',
                description: 'Executive room designed for business travelers with work desk and premium amenities.',
                images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
                amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service', 'Work Desk', 'Coffee Maker'],
            },
            {
                roomNumber: '302',
                type: 'Executive',
                price: 220.00,
                status: 'Available',
                capacity: 2,
                size: '480 sq ft',
                description: 'Premium executive room with enhanced workspace and luxury furnishings.',
                images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
                amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service', 'Work Desk', 'Coffee Maker', 'Safe'],
            },
            // Presidential Suite
            {
                roomNumber: '401',
                type: 'Presidential',
                price: 500.00,
                status: 'Available',
                capacity: 6,
                size: '1200 sq ft',
                description: 'The ultimate luxury experience with multiple rooms, private dining, and exclusive services.',
                images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
                amenities: ['WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service', 'Kitchen', 'Balcony', 'Jacuzzi', 'Private Dining', 'Butler Service'],
            },
        ];
        // Create rooms
        for (const roomData of roomsData) {
            await models_1.Room.create(roomData);
        }
        console.log(`✅ Created ${roomsData.length} sample rooms`);
        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Default Admin Account:');
        console.log('Email: admin@hotelbooking.com');
        console.log('Password: admin123');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
    finally {
        // Close database connection
        await models_1.sequelize.close();
    }
};
// Run seeder if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
        console.log('✅ Seeding process completed');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Seeding process failed:', error);
        process.exit(1);
    });
}
exports.default = seedDatabase;
//# sourceMappingURL=seed.js.map