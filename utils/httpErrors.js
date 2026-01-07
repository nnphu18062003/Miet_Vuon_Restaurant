const AppError = require('./AppError');
const { StatusCodes } = require('http-status-codes');

class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, StatusCodes.FORBIDDEN);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, StatusCodes.NOT_FOUND);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, StatusCodes.CONFLICT);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error') {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    InternalServerError
};
