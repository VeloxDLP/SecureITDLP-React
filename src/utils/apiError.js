/**
 * ApiError
 * --------
 * Normalises every possible error shape — network failures,
 * Spring Boot validation errors, plain strings — into one
 * consistent object that the rest of the app can rely on.
 *
 * Spring Boot typically returns:
 *   { message, status, errors: [ { field, message } ] }
 *
 * Usage:
 *   catch (err) {
 *     const { message, status, fieldErrors } = normaliseError(err)
 *   }
 */

export class ApiError extends Error {
  constructor(message, status = 0, fieldErrors = {}, raw = null) {
    super(message)
    this.name       = 'ApiError'
    this.status     = status       // HTTP status code
    this.fieldErrors = fieldErrors // { fieldName: 'error message' }
    this.raw        = raw          // original error for debugging
  }
}

/**
 * Takes any thrown value and returns a normalised ApiError.
 */
export const normaliseError = (err) => {
  // No response — network error or timeout
  if (!err.response) {
    return new ApiError(
      err.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : 'Network error. Check your connection.',
      0,
      {},
      err,
    )
  }

  const { status, data } = err.response

  // Parse Spring Boot field-level validation errors
  // Spring Boot: { errors: [{ field: 'username', defaultMessage: '...' }] }
  const fieldErrors = {}
  if (Array.isArray(data?.errors)) {
    data.errors.forEach(({ field, defaultMessage, message }) => {
      fieldErrors[field] = defaultMessage || message
    })
  }

  // Extract human-readable message in order of preference
  const message =
    data?.message ||
    data?.error   ||
    data?.title   ||
    getStatusMessage(status)

  return new ApiError(message, status, fieldErrors, err)
}

const getStatusMessage = (status) => {
  const map = {
    400: 'Invalid request. Please check your input.',
    401: 'Your session has expired. Please sign in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'A conflict occurred. The resource may already exist.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please wait a moment.',
    500: 'Server error. Please try again later.',
    502: 'Service unavailable. Please try again later.',
    503: 'Service is currently down. Please try again later.',
  }
  return map[status] || `Unexpected error (${status}).`
}