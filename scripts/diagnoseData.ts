import { BikeModel, connectToDatabase } from '../src/lib/database'
import mongoose from 'mongoose'

async function diagnose() {
    try {
        console.log('Connecting to database...')
        await connectToDatabase()

        console.log('Connected to database:', mongoose.connection.db?.databaseName)
        console.log('Active DB name (mongoose):', mongoose.connection.name)
        const adminDb = mongoose.connection.db?.admin()
        const dbs = await adminDb?.listDatabases()
        console.log('All databases in cluster:', dbs?.databases.map(d => d.name))

        const db = mongoose.connection.db
        const collections = await db?.listCollections().toArray()
        console.log('Collections in current database:', collections?.map(c => c.name))

        const bikeCount = await BikeModel.countDocuments({})
        console.log('Total bikes in collection:', bikeCount)

        const featuredBikes = await BikeModel.find({ isFeatured: true, status: { $in: ['active', 'available'] } })
        console.log('Featured and Active/Available bikes count:', featuredBikes.length)

        const soldBikes = await BikeModel.find({ status: 'sold' })
        console.log('Sold bikes count:', soldBikes.length)

        if (bikeCount > 0) {
            const oneBike = await BikeModel.findOne({})
            console.log('Sample bike data:', JSON.stringify(oneBike, null, 2))
        }

        process.exit(0)
    } catch (error) {
        console.error('❌ Error diagnosing:', error)
        process.exit(1)
    }
}

diagnose()
