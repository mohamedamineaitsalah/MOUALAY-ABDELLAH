const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = 'Duplicate field value entered';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized to access this route';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size is too large. Max limit is 10MB.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
};

module.exports = errorHandler;
