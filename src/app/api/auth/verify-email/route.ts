import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, UserModel } from '@/lib/database'
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

    await connectToDatabase()

    // Find user by email
    const user = await UserModel.findOne({ email })
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

    // Update user as verified using Mongoose
    await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          isEmailVerified: true,
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