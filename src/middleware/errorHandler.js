const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Organization name already exists'
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};

module.exports = errorHandler;