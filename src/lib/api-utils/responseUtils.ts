import { NextResponse } from 'next/server'
import { IApiResponse, IGenericErrorMessage } from '../interfaces/error'

interface ISuccessResponse<T = any> {
  statusCode?: number
  message: string
  data?: T
  meta?: {
    totalPages: number
    page: number
    total: number
    limit: number
  }
}

interface IErrorResponse {
  statusCode?: number
  message: string
  errors?: IGenericErrorMessage[]
}

export const sendSuccessResponse = <T>(response: ISuccessResponse<T>) => {
  const responseData: IApiResponse<T> = {
    success: true,
    statusCode: response.statusCode || 200,
    message: response.message,
    data: response.data,
  }

  if (response.meta) {
    responseData.meta = response.meta
  }

  return NextResponse.json(responseData, { status: response.statusCode || 200 })
}

export const sendErrorResponse = (response: IErrorResponse) => {
  const responseData: IApiResponse = {
    success: false,
    statusCode: response.statusCode || 500,
    message: response.message,
    errors: response.errors,
  }

  return NextResponse.json(responseData, { status: response.statusCode || 500 })
}

export const sendPaginatedResponse = <T>(
  data: T,
  total: number,
  page: number,
  limit: number,
  message: string = 'Data retrieved successfully',
  statusCode: number = 200
) => {
  const totalPages = Math.ceil(total / limit)
  
  return sendSuccessResponse({
    statusCode,
    message,
    data,
    meta: {
      totalPages,
      page,
      total,
      limit,
    },
  })
}