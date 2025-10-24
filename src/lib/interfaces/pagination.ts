export interface IPaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface IPaginationResult {
  page: number
  limit: number
  skip: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface IGenericResponse<T> {
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  data: T
}