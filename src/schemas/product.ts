import Joi from 'joi';

// Product creation schema
export const productSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Product name must be at least 2 characters long',
        'string.max': 'Product name must not exceed 100 characters',
        'any.required': 'Product name is required'
    }),
    description: Joi.string().max(500).allow('').optional().messages({
        'string.max': 'Description must not exceed 500 characters'
    }),
    price: Joi.number().positive().precision(2).required().messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required'
    }),
    sku: Joi.string().min(3).max(50).pattern(/^[A-Za-z0-9-_]+$/).required().messages({
        'string.min': 'SKU must be at least 3 characters long',
        'string.max': 'SKU must not exceed 50 characters',
        'string.pattern.base': 'SKU can only contain letters, numbers, hyphens, and underscores',
        'any.required': 'SKU is required'
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock must be non-negative',
        'any.required': 'Stock is required'
    }),
    categoryId: Joi.number().integer().positive().required().messages({
        'number.integer': 'Category ID must be an integer',
        'number.positive': 'Category ID must be positive',
        'any.required': 'Category ID is required'
    })
});

export const inventoryUpdateSchema = Joi.object({
    changeAmount: Joi.number().integer().required().messages({
        'number.integer': 'Change amount must be an integer',
        'any.required': 'Change amount is required'
    }),
    reason: Joi.string().max(200).optional().messages({
        'string.max': 'Reason must not exceed 200 characters'
    })
});

export const productQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional().messages({
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(100).optional().messages({
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must not exceed 100'
    }),
    category: Joi.number().integer().positive().optional(),
    lowStock: Joi.boolean().optional(),
    search: Joi.string().optional(),
    lowStockThreshold: Joi.number().integer().min(1).optional()
}); 