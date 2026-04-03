import type { HttpContext } from '@adonisjs/core/http'
import OpenFoodFactsService from '#services/open_food_facts_service'

export default class FoodController {
    private service = new OpenFoodFactsService()

    /**
     * @getProduct
     * @tag OpenFoodFacts
     * @summary Get product by barcode
     * @paramPath barcode - Product barcode - @type(string) @required
     * @responseBody 200 - Product
     * @responseBody 500 - {"message": "Product not found"}
     */
    public async getProduct({ params, response }: HttpContext) {
        const { barcode } = params

        try {
            const product = await this.service.getProduct(barcode)
            return response.ok(product)
        } catch (error: any) {
            return response.internalServerError({ message: error?.message ?? 'Product not found' })
        }
    }

    /**
     * @search
     * @tag OpenFoodFacts
     * @summary Search products
     * @paramQuery q - Search query - @type(string)
     * @paramQuery page - Page number - @type(number)
     * @paramQuery page_size - Page size - @type(number)
     * @responseBody 200 - Product list
     * @responseBody 500 - {"message": "Error searching products"}
     */
    public async search({ request, response }: HttpContext) {
        const query: string = request.input('q')
        const page: number = request.input('page', 1)
        const pageSize: number = request.input('page_size', 20)

        try {
            const data = await this.service.searchProduct(query, page, pageSize)
            return response.ok(data)
        } catch {
            return response.internalServerError({ message: 'Error searching products' })
        }
    }
}
