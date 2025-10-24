import { IPaginationOptions, IPaginationResult } from '../interfaces/pagination'

const calculatePagination = (options: IPaginationOptions): IPaginationResult => {
  const page = Number(options.page || 1)
  const limit = Number(options.limit || 10)

  const skip = (page - 1) * limit

  const sortBy = options.sortBy || 'createdAt'
  const sortOrder = (options.sortOrder === 'asc' || options.sortOrder === 'desc') 
    ? options.sortOrder 
    : 'desc'

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  }
}

export const paginationHelper = {
  calculatePagination,
}