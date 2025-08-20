import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
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

    const db = await getDatabase()
    const usersCollection = db.collection('users')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
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

    // Create user document
    const newUser = {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: 'user',
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert user into database
    const result = await usersCollection.insertOne(newUser)

    // Send verification email
    const emailSent = await EmailService.sendVerificationEmail(email, verificationCode)
    
    if (!emailSent) {
      console.warn('Failed to send verification email to:', email)
    }

    return NextResponse.json(
      {
        message: 'User registered successfully. Please check your email for verification code.',
        userId: result.insertedId,
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