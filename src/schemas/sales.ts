import Joi from 'joi';

export const saleSchema = Joi.object({
    productId: Joi.number().integer().positive().required().messages({
        'number.integer': 'Product ID must be an integer',
        'number.positive': 'Product ID must be positive',
        'any.required': 'Product ID is required'
    }),
    quantity: Joi.number().integer().positive().required().messages({
        'number.integer': 'Quantity must be an integer',
        'number.positive': 'Quantity must be positive',
        'any.required': 'Quantity is required'
    })
});

export const salesQuerySchema = Joi.object({
    startDate: Joi.date().iso().optional().messages({
        'date.format': 'Start date must be a valid ISO 8601 date'
    }),
    endDate: Joi.date().iso().optional().messages({
        'date.format': 'End date must be a valid ISO 8601 date'
    }),
    productId: Joi.number().integer().positive().optional(),
    categoryId: Joi.number().integer().positive().optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
});

export const salesComparisonQuerySchema = Joi.object({
    currentStartDate: Joi.date().iso().required().messages({
        'date.format': 'Current start date must be a valid ISO 8601 date',
        'any.required': 'Current start date is required'
    }),
    currentEndDate: Joi.date().iso().required().messages({
        'date.format': 'Current end date must be a valid ISO 8601 date',
        'any.required': 'Current end date is required'
    }),
    previousStartDate: Joi.date().iso().required().messages({
        'date.format': 'Previous start date must be a valid ISO 8601 date',
        'any.required': 'Previous start date is required'
    }),
    previousEndDate: Joi.date().iso().required().messages({
        'date.format': 'Previous end date must be a valid ISO 8601 date',
        'any.required': 'Previous end date is required'
    })
});

export const revenueAnalyticsQuerySchema = Joi.object({
    period: Joi.string().valid('daily', 'weekly', 'monthly', 'annual').optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
}); 