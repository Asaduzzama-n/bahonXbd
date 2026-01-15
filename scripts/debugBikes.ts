import { BikeModel, connectToDatabase } from '../src/lib/database'

async function debugBikes() {
    try {
        console.log('Connecting to database...')
        await connectToDatabase()

        console.log('\n🔍 Debugging Bike Queries:\n')

        // Check what statuses exist
        const allBikes = await BikeModel.find({}).select('title status').lean()
        console.log('All bikes with their statuses:')
        allBikes.forEach((bike, i) => {
            console.log(`${i + 1}. ${bike.title} - status: "${bike.status}"`)
        })

        console.log('\n--- Testing Filters ---\n')

        // Test the filter used in the API
        const apiFilter = { status: { $in: ['active', 'available'] } }
        const apiResults = await BikeModel.find(apiFilter).select('title status').lean()
        console.log(`Filter: { status: { $in: ['active', 'available'] } }`)
        console.log(`Results: ${apiResults.length} bikes`)
        apiResults.forEach(bike => console.log(`  - ${bike.title} (${bike.status})`))

        console.log('\n')

        // Test sold filter
        const soldFilter = { status: 'sold' }
        const soldResults = await BikeModel.find(soldFilter).select('title status').lean()
        console.log(`Filter: { status: 'sold' }`)
        console.log(`Results: ${soldResults.length} bikes`)
        soldResults.forEach(bike => console.log(`  - ${bike.title} (${bike.status})`))

        console.log('\n')

        // Test featured filter
        const featuredFilter = { isFeatured: true, status: { $in: ['active', 'available'] } }
        const featuredResults = await BikeModel.find(featuredFilter).select('title status isFeatured').lean()
        console.log(`Filter: { isFeatured: true, status: { $in: ['active', 'available'] } }`)
        console.log(`Results: ${featuredResults.length} bikes`)
        featuredResults.forEach(bike => console.log(`  - ${bike.title} (${bike.status}, featured: ${bike.isFeatured})`))

        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

debugBikes()
