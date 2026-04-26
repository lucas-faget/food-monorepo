import { createProductValidator, updateProductValidator } from '#validators/product'

const createProductSchema = createProductValidator.toJSONSchema()
const updateProductSchema = updateProductValidator.toJSONSchema()

export const openapi = {
    openapi: '3.0.0',

    info: {
        title: 'Food Api',
        version: '1.0.0',
    },

    tags: [{ name: 'Products' }, { name: 'OpenFoodFacts' }],

    paths: {
        '/products': {
            get: {
                summary: 'List products',
                tags: ['Products'],
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        schema: { type: 'number', default: 1 },
                    },
                    {
                        name: 'page_size',
                        in: 'query',
                        schema: { type: 'number', default: 20 },
                    },
                ],
                responses: {
                    200: {
                        description: 'Paginated list of products',
                    },
                },
            },
            post: {
                summary: 'Create product',
                tags: ['Products'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: createProductSchema,
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Product created',
                    },
                },
            },
        },
        '/products/{id}': {
            get: {
                summary: 'Get product by ID',
                tags: ['Products'],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'number' },
                    },
                ],
                responses: {
                    200: { description: 'Product found' },
                    404: { description: 'Product not found' },
                },
            },
            put: {
                summary: 'Update product',
                tags: ['Products'],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'number' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: updateProductSchema,
                        },
                    },
                },
                responses: {
                    200: { description: 'Product updated' },
                    404: { description: 'Product not found' },
                },
            },
            delete: {
                summary: 'Delete product',
                tags: ['Products'],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'number' },
                    },
                ],
                responses: {
                    204: { description: 'No content' },
                    404: { description: 'Product not found' },
                },
            },
        },

        '/food/{barcode}': {
            get: {
                summary: 'Get product by barcode',
                tags: ['OpenFoodFacts'],
                parameters: [
                    {
                        name: 'barcode',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Product barcode',
                    },
                ],
                responses: {
                    200: {
                        description: 'Product found',
                    },
                    500: {
                        description: 'Product not found',
                    },
                },
            },
        },
        '/food': {
            get: {
                summary: 'Search products',
                tags: ['OpenFoodFacts'],
                parameters: [
                    {
                        name: 'q',
                        in: 'query',
                        schema: { type: 'string' },
                        description: 'Search query',
                    },
                    {
                        name: 'page',
                        in: 'query',
                        schema: { type: 'number', default: 1 },
                    },
                    {
                        name: 'page_size',
                        in: 'query',
                        schema: { type: 'number', default: 20 },
                    },
                ],
                responses: {
                    200: {
                        description: 'Product list',
                    },
                    500: {
                        description: 'Error searching products',
                    },
                },
            },
        },
    },

    components: {
        schemas: {
            CreateProduct: createProductSchema,
            UpdateProduct: updateProductSchema,
        },
    },
}
