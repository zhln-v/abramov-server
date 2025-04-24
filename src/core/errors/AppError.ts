export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Не найдено') {
        super(message, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Неверный запрос') {
        super(message, 400);
    }
}
