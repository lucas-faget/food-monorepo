import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'

export default class ProductsController {
    /**
     * @index
     * @tag Products
     * @paramQuery page - Page number - @type(number)
     * @paramQuery page_size - Page size - @type(number)
     * @responseBody 200 - <Product[]>.paginated()
     */
    public async index({ request, response }: HttpContext) {
        const page = request.input('page', 1)
        const pageSize = request.input('page_size', 20)

        const products = await Product.query()
            .orderBy('created_at', 'desc')
            .paginate(page, pageSize)

        return response.ok(products)
    }

    /**
     * @show
     * @tag Products
     * @paramPath id - Product ID - @type(number) @required
     * @responseBody 200 - <Product>
     * @responseBody 404 - {"message": "Product not found"}
     */
    public async show({ params, response }: HttpContext) {
        const product = await Product.find(params.id)

        if (!product) {
            return response.notFound({ message: 'Product not found' })
        }

        return response.ok(product)
    }

    /**
     * @store
     * @tag Products
     * @requestBody <createProductValidator>
     * @responseBody 201 - <Product>
     */
    public async store({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createProductValidator)

        const product = await Product.create(payload)

        return response.created(product)
    }

    /**
     * @update
     * @tag Products
     * @paramPath id - Product ID - @type(number) @required
     * @requestBody <updateProductValidator>
     * @responseBody 200 - <Product>
     * @responseBody 404 - {"message": "Product not found"}
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
     * @destroy
     * @tag Products
     * @paramPath id - Product ID - @type(number) @required
     * @responseBody 204 - No content
     * @responseBody 404 - {"message": "Product not found"}
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
