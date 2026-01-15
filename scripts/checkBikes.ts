import { BikeModel, connectToDatabase } from '../src/lib/database'

async function checkBikes() {
    try {
        console.log('Connecting to database...')
        await connectToDatabase()

        console.log('\n📊 Database Statistics:')

        const totalBikes = await BikeModel.countDocuments()
        console.log(`Total bikes: ${totalBikes}`)

        const availableBikes = await BikeModel.countDocuments({ status: 'available' })
        console.log(`Available bikes: ${availableBikes}`)

        const soldBikes = await BikeModel.countDocuments({ status: 'sold' })
        console.log(`Sold bikes: ${soldBikes}`)

        const featuredBikes = await BikeModel.countDocuments({ isFeatured: true })
        console.log(`Featured bikes: ${featuredBikes}`)

        console.log('\n📋 All Bikes:')
        const bikes = await BikeModel.find({}).select('title brand model status isFeatured').lean()

        if (bikes.length === 0) {
            console.log('❌ No bikes found in database!')
        } else {
            bikes.forEach((bike, index) => {
                console.log(`${index + 1}. ${bike.title} - ${bike.brand} ${bike.model} (${bike.status}) ${bike.isFeatured ? '⭐' : ''}`)
            })
        }

        process.exit(0)
    } catch (error) {
        console.error('❌ Error checking bikes:', error)
        process.exit(1)
    }
}

checkBikes()
