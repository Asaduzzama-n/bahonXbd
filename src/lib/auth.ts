import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  }

  static generateVerificationToken(email: string): string {
    return jwt.sign({ email, type: 'verification' }, JWT_SECRET, { expiresIn: '24h' })
  }

  static verifyEmailToken(token: string): { email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      if (decoded.type === 'verification') {
        return { email: decoded.email }
      }
      return null
    } catch (error) {
      return null
    }
  }

  static generateResetToken(email: string): string {
    return jwt.sign({ email, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' })
  }

  static verifyResetToken(token: string): { email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      if (decoded.type === 'reset') {
        return { email: decoded.email }
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