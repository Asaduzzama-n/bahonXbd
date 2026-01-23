import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/database'
import { BikeModel } from '@/lib/database'

export const GET = async (request: NextRequest) => {
    await connectToDatabase()

    const db = mongoose.connection.db
    const collections = await db?.listCollections().toArray()
    const collectionNames = collections?.map(c => c.name) || []

    const bikeCount = await BikeModel.countDocuments({})
    const rawBikeCount = await mongoose.connection.collection('bikes').countDocuments({})

    const debugInfo = {
        connectionState: mongoose.connection.readyState,
        dbName: mongoose.connection.name,
        dbInstanceName: db?.databaseName,
        collections: collectionNames,
        bikeModelCollection: BikeModel.collection.name,
        totalBikesViaModel: bikeCount,
        totalBikesViaRaw: rawBikeCount,
        envUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
        uriValue: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/.*@/, '//****:****@') : 'N/A'
    }

    return NextResponse.json(debugInfo)
}
