const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the full error for debugging

    // Avoid circular references by selecting only necessary fields
    const safeError = {
        message: err.message,
        status: err.status || 500,
    };

    res.status(safeError.status).json(safeError);
};

module.exports = errorHandler;
