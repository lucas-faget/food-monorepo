import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
    /**
     * GET /categories
     */
    public async index({ response }: HttpContext) {
        const categories = await Category.query().select('tag', 'name').orderBy('name', 'asc')

        return response.ok(categories)
    }
}
