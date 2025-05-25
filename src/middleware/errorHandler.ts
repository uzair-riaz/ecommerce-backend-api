import { NextFunction, Request, Response } from 'express';
import { ApiError, ValidationError } from '../errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof ValidationError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details
        });
        return;
    }

    if (err instanceof ApiError && err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }

    console.error('Unexpected error:', err);
    res.status(500).json({
        success: false,
        message: 'An internal error occurred. Please try again later.'
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new ApiError(`Not found - ${req.originalUrl}`, 404);
    next(error);
};
