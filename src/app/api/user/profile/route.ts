import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { AuthUtils } from '@/lib/auth'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-platform'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = AuthUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('users')

    // Get user profile
    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { 
        projection: { 
          password: 0, 
          verificationCode: 0, 
          verificationExpiry: 0,
          resetPasswordToken: 0,
          resetPasswordExpiry: 0
        } 
      }
    )

    await client.close()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { status: 200 })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = AuthUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { name, phone } = await request.json()

    // Validate input
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('users')

    // Update user profile
    const updateData: any = {
      name: name.trim(),
      updatedAt: new Date()
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim()
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      await client.close()
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get updated user profile
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { 
        projection: { 
          password: 0, 
          verificationCode: 0, 
          verificationExpiry: 0,
          resetPasswordToken: 0,
          resetPasswordExpiry: 0
        } 
      }
    )

    await client.close()

    return NextResponse.json(updatedUser, { status: 200 })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}