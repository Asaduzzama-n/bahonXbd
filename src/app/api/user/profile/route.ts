import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, UserModel } from '@/lib/database'
import { AuthUtils } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = await AuthUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    // Get user profile using Mongoose
    const user = await UserModel.findById(decoded.userId).select(
      '-password -verificationCode -verificationExpiry -resetPasswordToken -resetPasswordExpiry'
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Convert to plain object and transform _id
    const userObj = user.toObject()
    userObj.id = userObj._id.toString()
    delete userObj._id

    return NextResponse.json(userObj, { status: 200 })

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
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = await AuthUtils.verifyToken(token)
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

    await connectToDatabase()

    // Update user profile using Mongoose
    const updateData: any = {
      name: name.trim()
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim()
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { 
        new: true,
        select: '-password -verificationCode -verificationExpiry -resetPasswordToken -resetPasswordExpiry'
      }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Convert to plain object and transform _id
    const userObj = updatedUser.toObject()
    userObj.id = userObj._id.toString()
    delete userObj._id

    return NextResponse.json(userObj, { status: 200 })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}