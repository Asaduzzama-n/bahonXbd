import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { AuthUtils } from '@/lib/auth'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-platform'

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

    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('users')

    // Get user
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(decoded.userId) 
    })

    if (!user) {
      await client.close()
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await AuthUtils.comparePassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      await client.close()
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await AuthUtils.hashPassword(newPassword)

    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          password: hashedNewPassword,
          updatedAt: new Date()
        }
      }
    )

    await client.close()

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}