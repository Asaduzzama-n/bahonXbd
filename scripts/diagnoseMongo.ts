import { connectToDatabase, BikeModel } from '../src/lib/database'

async function diagnose() {
    try {
        console.log('🔍 MongoDB Connection Diagnostics\n')

        // Get the MongoDB URI from environment (without exposing sensitive parts)
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-platform'
        const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
        console.log(`MongoDB URI: ${sanitizedUri}\n`)

        console.log('Connecting to database...')
        const mongoose = await connectToDatabase()

        console.log(`✅ Connected to: ${mongoose.connection.name}`)
        console.log(`   Host: ${mongoose.connection.host}`)
        console.log(`   Port: ${mongoose.connection.port}`)
        console.log(`   Database: ${mongoose.connection.db.databaseName}\n`)

        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray()
        console.log(`📁 Collections in database:`)
        collections.forEach(col => {
            console.log(`   - ${col.name}`)
        })

        console.log('\n📊 Bike Statistics:')
        const totalBikes = await BikeModel.countDocuments()
        console.log(`   Total bikes: ${totalBikes}`)

        if (totalBikes > 0) {
            const availableBikes = await BikeModel.countDocuments({ status: 'available' })
            const soldBikes = await BikeModel.countDocuments({ status: 'sold' })
            const featuredBikes = await BikeModel.countDocuments({ isFeatured: true })

            console.log(`   Available: ${availableBikes}`)
            console.log(`   Sold: ${soldBikes}`)
            console.log(`   Featured: ${featuredBikes}`)

            console.log('\n📋 Sample bikes:')
            const samples = await BikeModel.find({}).limit(3).select('title status').lean()
            samples.forEach((bike, i) => {
                console.log(`   ${i + 1}. ${bike.title} (${bike.status})`)
            })
        } else {
            console.log('   ⚠️ No bikes found in database!')
        }

        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

diagnose()
