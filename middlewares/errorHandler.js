const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/AppError');

const sendErrorDev = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api') || req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(err.statusCode).json({
            ok: false,
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // Render Website
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
        user: req.user || null // Ensure user is passed if available
    });
};

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api') || req.xhr || req.headers.accept.indexOf('json') > -1) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                ok: false,
                status: err.status,
                message: err.message
            });
        }
        // Programming or other unknown error: don't leak details
        console.error('ERROR 💥', err);
        return res.status(500).json({
            ok: false,
            status: 'error',
            message: 'Something went very wrong!'
        });
    }

    // B) RENDERED WEBSITE
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
            user: req.user || null
        });
    }
    // Programming or other unknown error: don't leak details
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.',
        user: req.user || null
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Handle specific DB errors (e.g., CastError, DuplicateFields) here
        // if (error.name === 'CastError') error = handleCastErrorDB(error);
        // if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        sendErrorProd(error, req, res);
    }
};
