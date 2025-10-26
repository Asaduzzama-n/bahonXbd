import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import mongoose from 'mongoose'
import { IGenericErrorMessage } from '../interfaces/error'
import handleValidationError from '../errors/handleValidationError'
import handleZodError from '../errors/handleZodError'
import handleCastError from '../errors/handleCastError'
import ApiError from '../errors/ApiError'
import { sendErrorResponse } from '../api-utils/responseUtils'

export const globalErrorHandler = (error: any) => {
  console.log('🪐 Global Error Handler:', error)

  let statusCode = 500
  let message = 'Something went wrong!'
  let errorMessages: IGenericErrorMessage[] = []

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode
    message = error?.message
    errorMessages = error?.message
      ? [{ path: '', message: error?.message }]
      : []
  } else if (error instanceof Error) {
    message = error?.message
    errorMessages = error?.message
      ? [{ path: '', message: error?.message }]
      : []
  }

  return sendErrorResponse({
    statusCode,
    message,
    errors: errorMessages,
  })
}

// Wrapper function for API route handlers
export const withErrorHandler = (handler: Function) => {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      return globalErrorHandler(error)
    }
  }
}