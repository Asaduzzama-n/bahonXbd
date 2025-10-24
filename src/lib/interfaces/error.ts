export interface IGenericErrorMessage {
  path: string | number
  message: string
}

export interface IGenericErrorResponse {
  statusCode: number
  message: string
  errorMessages: IGenericErrorMessage[]
}

export interface IApiResponse<T = any> {
  success: boolean
  statusCode: number
  message: string
  errors?: IGenericErrorMessage[]
  data?: T
  meta?: {
    totalPages: number
    page: number
    total: number
    limit: number
  }
}