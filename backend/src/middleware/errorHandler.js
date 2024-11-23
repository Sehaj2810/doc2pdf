// backend/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: err.errors
      });
    }
  
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        message: 'Unauthorized access'
      });
    }
  
    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum file size is 10MB'
      });
    }
  
    // Generic server error
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  export default errorHandler;