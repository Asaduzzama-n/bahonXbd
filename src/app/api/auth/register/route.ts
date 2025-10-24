import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, UserModel } from '@/lib/database'
import { AuthUtils, generateVerificationCode } from '@/lib/auth'
import { EmailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password)

    // Generate verification code
    const verificationCode = generateVerificationCode()

    // Create user using Mongoose model
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: 'user',
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })

    // Save user to database
    const savedUser = await newUser.save()

    // Send verification email
    const emailSent = await EmailService.sendVerificationEmail(email, verificationCode)
    
    if (!emailSent) {
      console.warn('Failed to send verification email to:', email)
    }

    return NextResponse.json(
      {
        message: 'User registered successfully. Please check your email for verification code.',
        userId: savedUser._id.toString(),
        emailSent,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}