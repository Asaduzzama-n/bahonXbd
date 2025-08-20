import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { AuthUtils } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// GET - Fetch bikes with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const brand = searchParams.get('brand')
    const condition = searchParams.get('condition')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1

    const db = await getDatabase()
    const bikesCollection = db.collection('bikes')

    // Build filter query
    const filter: any = { isActive: true }

    if (brand) filter.brand = { $regex: brand, $options: 'i' }
    if (condition) filter.condition = condition
    if (location) filter.location = { $regex: location, $options: 'i' }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseInt(minPrice)
      if (maxPrice) filter.price.$lte = parseInt(maxPrice)
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Fetch bikes with pagination
    const bikes = await bikesCollection
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const totalCount = await bikesCollection.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      bikes,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error('Fetch bikes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new bike listing
export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookie
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = AuthUtils.verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const bikeData = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'brand', 'model', 'year', 'price', 'condition', 'location']
    for (const field of requiredFields) {
      if (!bikeData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const db = await getDatabase()
    const bikesCollection = db.collection('bikes')

    // Create bike document
    const newBike = {
      ...bikeData,
      sellerId: new ObjectId(payload.userId),
      sellerEmail: payload.email,
      isActive: true,
      isVerified: false,
      isFeatured: false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await bikesCollection.insertOne(newBike)

    return NextResponse.json(
      {
        message: 'Bike listing created successfully',
        bikeId: result.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create bike error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update bike listing
export async function PUT(request: NextRequest) {
  try {
    // Get auth token from cookie
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = AuthUtils.verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { bikeId, ...updateData } = await request.json()

    if (!bikeId) {
      return NextResponse.json(
        { error: 'Bike ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const bikesCollection = db.collection('bikes')

    // Check if bike exists and user owns it (or is admin)
    const bike = await bikesCollection.findOne({ _id: new ObjectId(bikeId) })
    if (!bike) {
      return NextResponse.json(
        { error: 'Bike not found' },
        { status: 404 }
      )
    }

    if (bike.sellerId.toString() !== payload.userId && payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this bike' },
        { status: 403 }
      )
    }

    // Update bike
    const result = await bikesCollection.updateOne(
      { _id: new ObjectId(bikeId) },
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

// DELETE - Delete bike listing
export async function DELETE(request: NextRequest) {
  try {
    // Get auth token from cookie
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = AuthUtils.verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const bikeId = searchParams.get('id')

    if (!bikeId) {
      return NextResponse.json(
        { error: 'Bike ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const bikesCollection = db.collection('bikes')

    // Check if bike exists and user owns it (or is admin)
    const bike = await bikesCollection.findOne({ _id: new ObjectId(bikeId) })
    if (!bike) {
      return NextResponse.json(
        { error: 'Bike not found' },
        { status: 404 }
      )
    }

    if (bike.sellerId.toString() !== payload.userId && payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this bike' },
        { status: 403 }
      )
    }

    // Soft delete by setting isActive to false
    const result = await bikesCollection.updateOne(
      { _id: new ObjectId(bikeId) },
      {
        $set: {
          isActive: false,
          deletedAt: new Date(),
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
      { message: 'Bike deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete bike error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}