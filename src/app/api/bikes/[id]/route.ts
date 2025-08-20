import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch individual bike details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid bike ID' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const bikesCollection = db.collection('bikes')

    // Find bike by ID
    const bike = await bikesCollection.findOne({
      _id: new ObjectId(id),
      isActive: true,
    })

    if (!bike) {
      return NextResponse.json(
        { error: 'Bike not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await bikesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    )

    // Get seller information (excluding sensitive data)
    const usersCollection = db.collection('users')
    const seller = await usersCollection.findOne(
      { _id: bike.sellerId },
      { projection: { name: 1, phone: 1, email: 1, createdAt: 1 } }
    )

    return NextResponse.json({
      bike: {
        ...bike,
        seller,
      },
    })
  } catch (error) {
    console.error('Fetch bike details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update specific bike fields (like view count, featured status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updateData = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid bike ID' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const bikesCollection = db.collection('bikes')

    // Update bike
    const result = await bikesCollection.updateOne(
      { _id: new ObjectId(id), isActive: true },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Bike not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Bike updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update bike error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}