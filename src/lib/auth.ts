import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mySecretKey')

export interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'user'
}

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  static async generateToken(payload: any): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)
  }

  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payload as any
    } catch (error) {
      console.error('JWT Verification Error:', error)
      return null
    }
  }

  static async generateVerificationToken(email: string): Promise<string> {
    return await new SignJWT({ email, type: 'verification' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET)
  }

  static async verifyEmailToken(token: string): Promise<{ email: string } | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      if (payload.type === 'verification') {
        return { email: payload.email as string }
      }
      return null
    } catch (error) {
      return null
    }
  }

  static async generateResetToken(email: string): Promise<string> {
    return await new SignJWT({ email, type: 'reset' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(JWT_SECRET)
  }

  static async verifyResetToken(token: string): Promise<{ email: string } | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      if (payload.type === 'reset') {
        return { email: payload.email as string }
      }
      return null
    } catch (error) {
      return null
    }
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}