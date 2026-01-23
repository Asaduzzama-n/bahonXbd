import mongoose from 'mongoose'
import { BikeModel, connectToDatabase } from '../src/lib/database'

const sampleBikes = [
    {
        bikeNumber: 'DHA-KA-12-3456',
        chassisNumber: 'HONDA1234567890',
        title: 'Honda CB Shine 125 - Excellent Condition',
        description: 'Well-maintained Honda CB Shine 125 with low mileage. Perfect for daily commuting. Single owner, all documents available.',
        brand: 'Honda',
        model: 'CB Shine 125',
        year: 2021,
        condition: 'excellent',
        mileage: 12500,
        price: 85000,
        purchasePrice: 72000,
        purchaseDate: new Date('2024-01-15'),
        myShare: 100,
        partners: [],
        images: [
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
            'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800'
        ],
        features: [
            'Electric Start',
            'Disc Brake',
            'LED Headlight',
            'Digital Speedometer',
            'Tubeless Tyres'
        ],
        sellerInfo: {
            name: 'Karim Ahmed',
            phone: '+8801712345678',
            email: 'karim@example.com',
            address: 'Dhanmondi, Dhaka'
        },
        sellerAvailableDocs: {
            nid: 'NID123456789',
            drivingLicense: 'DL987654321',
            proofOfAddress: 'Utility Bill'
        },
        bikeAvailableDocs: {
            taxToken: 'TT2024001',
            registration: 'REG2021001',
            insurance: 'INS2024001',
            fitnessReport: 'FIT2024001'
        },
        serviceHistory: [],
        status: 'available',
        isFeatured: true,
        views: 0
    },
    {
        bikeNumber: 'DHA-LA-23-4567',
        chassisNumber: 'YAMAHA2345678901',
        title: 'Yamaha FZS V3 - Sporty Performance',
        description: 'Powerful Yamaha FZS V3 in pristine condition. Great for both city rides and highway cruising. Well serviced and maintained.',
        brand: 'Yamaha',
        model: 'FZS V3',
        year: 2022,
        condition: 'excellent',
        mileage: 8500,
        price: 195000,
        purchasePrice: 175000,
        purchaseDate: new Date('2024-02-20'),
        myShare: 100,
        partners: [],
        images: [
            'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
            'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800'
        ],
        features: [
            'FI Engine',
            'ABS',
            'LED Lighting',
            'Digital Console',
            'Dual Channel ABS',
            'Muscular Tank Design'
        ],
        sellerInfo: {
            name: 'Rahim Uddin',
            phone: '+8801823456789',
            email: 'rahim@example.com',
            address: 'Uttara, Dhaka'
        },
        sellerAvailableDocs: {
            nid: 'NID234567890',
            drivingLicense: 'DL876543210'
        },
        bikeAvailableDocs: {
            taxToken: 'TT2024002',
            registration: 'REG2022002',
            insurance: 'INS2024002'
        },
        serviceHistory: [],
        status: 'available',
        isFeatured: true,
        views: 0
    },
    {
        bikeNumber: 'DHA-MA-34-5678',
        chassisNumber: 'HERO3456789012',
        title: 'Hero Splendor Plus - Fuel Efficient',
        description: 'Reliable Hero Splendor Plus, perfect for economical daily commuting. Low maintenance cost and excellent fuel efficiency.',
        brand: 'Hero',
        model: 'Splendor Plus',
        year: 2020,
        condition: 'good',
        mileage: 28000,
        price: 65000,
        purchasePrice: 55000,
        purchaseDate: new Date('2023-11-10'),
        myShare: 100,
        partners: [],
        images: [
            'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800'
        ],
        features: [
            'Kick Start',
            'Drum Brake',
            'Fuel Efficient Engine',
            'Comfortable Seat',
            'Long Range Tank'
        ],
        sellerInfo: {
            name: 'Salam Miah',
            phone: '+8801934567890',
            email: 'salam@example.com',
            address: 'Mirpur, Dhaka'
        },
        sellerAvailableDocs: {
            nid: 'NID345678901',
            drivingLicense: 'DL765432109'
        },
        bikeAvailableDocs: {
            taxToken: 'TT2024003',
            registration: 'REG2020003'
        },
        serviceHistory: [],
        status: 'available',
        isFeatured: false,
        views: 0
    },
    {
        bikeNumber: 'DHA-NA-45-6789',
        chassisNumber: 'BAJAJ4567890123',
        title: 'Bajaj Pulsar NS160 - Street Fighter',
        description: 'Aggressive styling Bajaj Pulsar NS160. Perfect for enthusiasts who love sporty bikes. Well maintained with regular servicing.',
        brand: 'Bajaj',
        model: 'Pulsar NS160',
        year: 2021,
        condition: 'good',
        mileage: 15000,
        price: 145000,
        purchasePrice: 130000,
        purchaseDate: new Date('2024-03-05'),
        myShare: 100,
        partners: [],
        images: [
            'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
            'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800'
        ],
        features: [
            'Perimeter Frame',
            'Rear Disc Brake',
            'Split Seats',
            'Digital Speedometer',
            'Sporty Graphics'
        ],
        sellerInfo: {
            name: 'Jamal Hossain',
            phone: '+8801645678901',
            email: 'jamal@example.com',
            address: 'Banani, Dhaka'
        },
        sellerAvailableDocs: {
            nid: 'NID456789012',
            drivingLicense: 'DL654321098'
        },
        bikeAvailableDocs: {
            taxToken: 'TT2024004',
            registration: 'REG2021004',
            insurance: 'INS2024004'
        },
        serviceHistory: [],
        status: 'available',
        isFeatured: true,
        views: 0
    },
    {
        bikeNumber: 'DHA-PA-56-7890',
        chassisNumber: 'TVS5678901234',
        title: 'TVS Apache RTR 160 4V - Race Tuned',
        description: 'High-performance TVS Apache RTR 160 4V with race-tuned fuel injection. Excellent handling and power delivery.',
        brand: 'TVS',
        model: 'Apache RTR 160 4V',
        year: 2022,
        condition: 'excellent',
        mileage: 9500,
        price: 165000,
        purchasePrice: 150000,
        purchaseDate: new Date('2024-01-25'),
        myShare: 100,
        partners: [],
        images: [
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
            'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800'
        ],
        features: [
            'Race Tuned FI',
            'Glide Through Technology',
            'LED DRL',
            'SmartXonnect',
            'Dual Channel ABS',
            'Slipper Clutch'
        ],
        sellerInfo: {
            name: 'Faruk Islam',
            phone: '+8801756789012',
            email: 'faruk@example.com',
            address: 'Gulshan, Dhaka'
        },
        sellerAvailableDocs: {
            nid: 'NID567890123',
            drivingLicense: 'DL543210987'
        },
        bikeAvailableDocs: {
            taxToken: 'TT2024005',
            registration: 'REG2022005',
            insurance: 'INS2024005',
            fitnessReport: 'FIT2024005'
        },
        serviceHistory: [],
        status: 'available',
        isFeatured: true,
        views: 0
    },
    {
        bikeNumber: 'DHA-RA-67-8901',
        chassisNumber: 'SUZUKI6789012345',
        title: 'Suzuki Gixxer SF - Fully Faired',
        description: 'Stunning Suzuki Gixxer SF with full fairing. Perfect blend of style and performance. Recently serviced.',
        brand: 'Suzuki',
        model: 'Gixxer SF',
        year: 2021,
        condition: 'good',
        mileage: 18000,
        price: 175000,
        purchasePrice: 160000,
        purchaseDate: new Date('2023-12-15'),
        myShare: 100,
        partners: [],
        images: [
            'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800'
        ],
        features: [
            'Full Fairing',
            'Fuel Injection',
            'LED Headlamp',
            'Digital Instrument Cluster',
            'Rear Disc Brake'
        ],
        sellerInfo: {
            name: 'Shakib Rahman',
            phone: '+8801867890123',
            email: 'shakib@example.com',
            address: 'Mohammadpur, Dhaka'
        },
        sellerAvailableDocs: {
            nid: 'NID678901234',
            drivingLicense: 'DL432109876'
        },
        bikeAvailableDocs: {
            taxToken: 'TT2024006',
            registration: 'REG2021006',
            insurance: 'INS2024006'
        },
        serviceHistory: [],
        status: 'sold',
        isFeatured: false,
        views: 0
    },
    {
        bikeNumber: 'DHA-SA-78-9012',
        chassisNumber: 'HONDA7890123456',
        title: 'Honda Hornet 2.0 - Premium Naked',
        description: 'Premium Honda Hornet 2.0 with aggressive styling. Powerful engine and advanced features. Like new condition.',
        brand: 'Honda',
        model: 'Hornet 2.0',
        year: 2023,
        condition: 'excellent',
        mileage: 4500,
        price: 185000,
        purchasePrice: 170000,
        purchaseDate: new Date('2024-04-10'),
        myShare: 100,
        partners: [],
        images: [
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
            'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800'
        ],
        features: [
            'BS6 Engine',
            'LED Headlamp',
            'Full Digital Meter',
            'Single Channel ABS',
            'USD Front Forks',
            'Muscular Tank'
        ],
        sellerInfo: {
            name: 'Tanvir Ahmed',
            phone: '+8801978901234',
            email: 'tanvir@example.com',
            address: 'Bashundhara, Dhaka'
        },
        sellerAvailableDocs: {
            nid: 'NID789012345',
            drivingLicense: 'DL321098765',
            proofOfAddress: 'Utility Bill'
        },
        bikeAvailableDocs: {
            taxToken: 'TT2024007',
            registration: 'REG2023007',
            insurance: 'INS2024007',
            fitnessReport: 'FIT2024007'
        },
        serviceHistory: [],
        status: 'sold',
        isFeatured: false,
        views: 0
    },
    {
        bikeNumber: 'DHA-TA-89-0123',
        chassisNumber: 'YAMAHA8901234567',
        title: 'Yamaha MT-15 - Street Fighter Beast',
        description: 'Iconic Yamaha MT-15 with aggressive street fighter styling. VVA technology for excellent performance. Well maintained.',
        brand: 'Yamaha',
        model: 'MT-15',
        year: 2022,
        condition: 'excellent',
        mileage: 11000,
        price: 295000,
        purchasePrice: 275000,
        purchaseDate: new Date('2024-02-28'),
        myShare: 100,
        partners: [],
        images: [
            'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
            'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800',
            'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800'
        ],
        features: [
            'VVA Technology',
            'Dual Channel ABS',
            'USD Front Forks',
            'LED Lighting',
            'Assist & Slipper Clutch',
            'Deltabox Frame'
        ],
        sellerInfo: {
            name: 'Imran Khan',
            phone: '+8801589012345',
            email: 'imran@example.com',
            address: 'Baridhara, Dhaka'
        },
        sellerAvailableDocs: {
            nid: 'NID890123456',
            drivingLicense: 'DL210987654',
            proofOfAddress: 'Utility Bill'
        },
        bikeAvailableDocs: {
            taxToken: 'TT2024008',
            registration: 'REG2022008',
            insurance: 'INS2024008',
            fitnessReport: 'FIT2024008'
        },
        serviceHistory: [],
        status: 'sold',
        isFeatured: false,
        views: 0
    }
]

async function seedBikes() {
    try {
        console.log('Connecting to database...')
        await connectToDatabase()

        console.log('Clearing existing bikes...')
        await BikeModel.deleteMany({})

        console.log('Seeding bikes...')
        const createdBikes = await BikeModel.insertMany(sampleBikes)

        console.log(`✅ Successfully seeded ${createdBikes.length} bikes!`)
        console.log(`   - Available bikes: ${createdBikes.filter(b => b.status === 'available').length}`)
        console.log(`   - Sold bikes: ${createdBikes.filter(b => b.status === 'sold').length}`)
        console.log(`   - Featured bikes: ${createdBikes.filter(b => b.isFeatured).length}`)

        process.exit(0)
    } catch (error) {
        console.error('❌ Error seeding bikes:', error)
        process.exit(1)
    }
}

seedBikes()
