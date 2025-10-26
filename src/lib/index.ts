// Error handling
export { default as ApiError } from './errors/ApiError'
export { default as handleZodError } from './errors/handleZodError'
export { default as handleValidationError } from './errors/handleValidationError'
export { default as handleCastError } from './errors/handleCastError'

// Middleware
export { globalErrorHandler, withErrorHandler } from './middleware/globalErrorHandler'

// Utilities
export { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendPaginatedResponse 
} from './api-utils/responseUtils'
export { 
  validateData, 
  validateQueryParams, 
  validateRequestBody,
  mongoIdSchema,
  paginationQuerySchema
} from './api-utils/validationUtils'

// Helpers
export { paginationHelper } from './helpers/paginationHelper'

// Interfaces
export type { 
  IGenericErrorMessage, 
  IGenericErrorResponse, 
  IApiResponse 
} from './interfaces/error'
export type { 
  IPaginationOptions, 
  IPaginationResult, 
  IGenericResponse 
} from './interfaces/pagination'