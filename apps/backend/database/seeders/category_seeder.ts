import Category from '#models/category'
import OpenFoodFactsService from '#services/open_food_facts_service'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
    async run() {
        const service = new OpenFoodFactsService()

        const categories = await service.getCategories()

        for (const category of categories) {
            await Category.create({
                tag: category.tag,
                name: category.name,
            })
        }
    }
}
