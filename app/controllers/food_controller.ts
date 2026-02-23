import type { HttpContext } from '@adonisjs/core/http'
import OpenFoodFactsService from '#services/open_food_facts_service'

export default class FoodController {
    private service = new OpenFoodFactsService()

    public async show({ params, response }: HttpContext) {
        const { barcode } = params

        try {
            const product = await this.service.getProduct(barcode)
            return response.ok(product)
        } catch (error) {
            return response.internalServerError({ message: error.message })
        }
    }

    public async search({ params, response }: HttpContext) {
        const { query, page } = params

        try {
            const data = await this.service.searchProduct(query, page)
            return response.ok(data)
        } catch {
            return response.internalServerError({ message: 'Error searching products' })
        }
    }
}
