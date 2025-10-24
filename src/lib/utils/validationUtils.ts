import { z, ZodSchema } from 'zod'
import ApiError from '../errors/ApiError'

export const validateData = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    throw result.error
  }
  
  return result.data
}

export const validateQueryParams = (searchParams: URLSearchParams, schema: ZodSchema) => {
  const queryObject: Record<string, string | null> = {}
  
  // Convert URLSearchParams to object
  for (const [key, value] of searchParams.entries()) {
    queryObject[key] = value
  }
  
  return validateData(schema, queryObject)
}

export const validateRequestBody = async (request: Request, schema: ZodSchema) => {
  try {
    const body = await request.json()
    return validateData(schema, body)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError(400, 'Invalid JSON in request body')
    }
    throw error
  }
}

// Common validation schemas
export const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')

export const paginationQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})