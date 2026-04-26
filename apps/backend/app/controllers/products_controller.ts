import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'

export default class ProductsController {
    /**
     * GET /products
     */
    public async index({ request, response }: HttpContext) {
        const page = request.input('page', 1)
        const perPage = request.input('page_size', 20)

        const products = await Product.query().orderBy('created_at', 'desc').paginate(page, perPage)

        return response.ok(products)
    }

    /**
     * GET /products/:id
     */
    public async show({ params, response }: HttpContext) {
        const product = await Product.find(params.id)

        if (!product) {
            return response.notFound({ message: 'Product not found' })
        }

        return response.ok(product)
    }

    /**
     * POST /products
     */
    public async store({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createProductValidator)

        const product = await Product.create(payload)

        return response.created(product)
    }

    /**
     * PUT /products/:id
     */
    public async update({ params, request, response }: HttpContext) {
        const product = await Product.find(params.id)

        if (!product) {
            return response.notFound({ message: 'Product not found' })
        }

        const payload = await request.validateUsing(updateProductValidator)

        product.merge(payload)
        await product.save()

        return response.ok(product)
    }

    /**
     * DELETE /products/:id
     */
    public async destroy({ params, response }: HttpContext) {
        const product = await Product.find(params.id)

        if (!product) {
            return response.notFound({ message: 'Product not found' })
        }

        await product.delete()

        return response.noContent()
    }
}
