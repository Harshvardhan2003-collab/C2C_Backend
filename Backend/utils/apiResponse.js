// Standardized API response utility
export class ApiResponse {
  constructor(statusCode, data, message = 'Success', pagination = null) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.timestamp = new Date().toISOString();
    
    if (pagination) {
      this.pagination = pagination;
    }
  }
}

// Helper functions for common responses
export const sendSuccess = (res, data, message = 'Success', statusCode = 200, pagination = null) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message, pagination));
};

export const sendError = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    statusCode,
    message,
    success: false,
    timestamp: new Date().toISOString()
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

export const sendCreated = (res, data, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res, message = 'No content') => {
  return res.status(204).json({
    statusCode: 204,
    message,
    success: true,
    timestamp: new Date().toISOString()
  });
};

export const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

export const sendBadRequest = (res, message = 'Bad request', errors = null) => {
  return sendError(res, message, 400, errors);
};

export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, message, 401);
};

export const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, message, 403);
};

export const sendConflict = (res, message = 'Conflict') => {
  return sendError(res, message, 409);
};

export const sendInternalError = (res, message = 'Internal server error') => {
  return sendError(res, message, 500);
};

export default {
  ApiResponse,
  sendSuccess,
  sendError,
  sendCreated,
  sendNoContent,
  sendNotFound,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendConflict,
  sendInternalError
};

