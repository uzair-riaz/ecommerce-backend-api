export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends ApiError {
    details?: Array<{
        field: string;
        message: string;
        value?: any;
    }>;

    constructor(message: string, details?: Array<{ field: string; message: string; value?: any }>) {
        super(message, 400);
        this.name = 'ValidationError';
        this.details = details;
    }
}

export class ProductNotFoundError extends ApiError {
    constructor(productId?: number | string) {
        const message = productId 
            ? `Product with ID ${productId} not found`
            : 'Product not found';
        super(message, 404);
        this.name = 'ProductNotFoundError';
    }
}

export class CategoryNotFoundError extends ApiError {
    constructor(categoryId?: number | string) {
        const message = categoryId 
            ? `Category with ID ${categoryId} not found`
            : 'Category not found';
        super(message, 404);
        this.name = 'CategoryNotFoundError';
    }
}

export class InsufficientStockError extends ApiError {
    availableStock: number;
    requestedQuantity: number;

    constructor(availableStock: number, requestedQuantity: number, productName?: string) {
        const productInfo = productName ? ` for product "${productName}"` : '';
        const message = `Insufficient stock${productInfo}. Available: ${availableStock}, Requested: ${requestedQuantity}`;
        super(message, 400);
        this.name = 'InsufficientStockError';
        this.availableStock = availableStock;
        this.requestedQuantity = requestedQuantity;
    }
}

export class DuplicateSkuError extends ApiError {
    sku: string;

    constructor(sku: string) {
        super(`Product with SKU "${sku}" already exists`, 409);
        this.name = 'DuplicateSkuError';
        this.sku = sku;
    }
} 