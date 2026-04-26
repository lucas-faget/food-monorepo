import type { HttpContext } from '@adonisjs/core/http'
import OpenFoodFactsService from '#services/open_food_facts_service'

export default class FoodController {
    private service = new OpenFoodFactsService()

    /**
     * GET /food/:barcode
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
     * GET /food
     */
    public async search({ request, response }: HttpContext) {
        const query: string = request.input('q')
        const page: number = request.input('page', 1)
        const perPage: number = request.input('page_size', 20)

        try {
            const data = await this.service.searchProduct(query, page, perPage)
            return response.ok(data)
        } catch {
            return response.internalServerError({ message: 'Error searching products' })
        }
    }
}
