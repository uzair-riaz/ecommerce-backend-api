import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ValidationError } from '../errors';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body);
        
        if (error) {
            const details = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));
            
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            throw new ValidationError(`Validation error: ${errorMessage}`, details);
        }
        
        next();
    };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.params);
        
        if (error) {
            const details = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));
            
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            throw new ValidationError(`Invalid parameters: ${errorMessage}`, details);
        }
        
        next();
    };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.query);
        
        if (error) {
            const details = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));
            
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            throw new ValidationError(`Invalid query parameters: ${errorMessage}`, details);
        }
        
        next();
    };
}; 