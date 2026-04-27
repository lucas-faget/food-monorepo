import type { HttpContext } from '@adonisjs/core/http'
import OpenFoodFactsService from '#services/open_food_facts_service'
import Product from '#models/product'

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
            const result = await this.service.searchProduct(query, page, perPage)

            const barcodes = result.data.map((p) => p.barcode)

            const existingProducts = await Product.query()
                .whereIn('barcode', barcodes)
                .select('barcode')

            const existingBarcodes = new Set(existingProducts.map((p) => p.barcode))

            const data = result.data.map((p) => ({
                ...p,
                added: existingBarcodes.has(p.barcode),
            }))

            return response.ok({
                ...result,
                data,
            })
        } catch {
            return response.internalServerError({ message: 'Error searching products' })
        }
    }
}
