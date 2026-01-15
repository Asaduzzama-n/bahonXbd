import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { EmailService } from '@/lib/email'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-platform'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('users')

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email })
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is already verified
    if (existingUser.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with new verification code
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          verificationCode,
          verificationExpiry,
          updatedAt: new Date()
        }
      }
    )

    // Send verification email using the correct Service
    try {
      await EmailService.sendVerificationEmail(email, verificationCode)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // We don't return error here so user knows code was generated
    }

    console.log(`Verification code for ${email}: ${verificationCode}`)

    await client.close()

    return NextResponse.json(
      { message: 'Verification code generated successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}