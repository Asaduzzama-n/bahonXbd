import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { EmailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, verificationCode } = await request.json()

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const usersCollection = db.collection('users')

    // Find user by email
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Check verification code
    if (user.verificationCode !== verificationCode) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Check if verification code has expired
    if (new Date() > user.verificationCodeExpires) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Update user as verified
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          isEmailVerified: true,
          updatedAt: new Date(),
        },
        $unset: {
          verificationCode: '',
          verificationCodeExpires: '',
        },
      }
    )

    // Send welcome email
    await EmailService.sendWelcomeEmail(email, user.name)

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}