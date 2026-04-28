import { OpenFoodFacts, SearchApi } from '@openfoodfacts/openfoodfacts-nodejs'

export default class OpenFoodFactsService {
    private fields = [
        'code',
        'product_name',
        'brands',
        'categories',
        'image_url',
        'serving_quantity',
        'serving_quantity_unit',
        'nutriments',
        'nutriscore_grade',
    ]
    private perPage: number = 20

    private client: OpenFoodFacts
    private searchClient: SearchApi

    constructor() {
        this.client = new OpenFoodFacts(globalThis.fetch)
        this.searchClient = new SearchApi(globalThis.fetch)
    }

    public async getProduct(barcode: string) {
        const { data, error } = await this.client.getProductV3(barcode, {
            fields: this.fields,
        })

        if (!data || data.status !== 'success') {
            throw new Error(error?.result?.name ?? 'Product not found')
        }

        const p = data.product

        return this.productDTO(p)
    }

    public async searchProduct(
        query: string = '',
        page: number = 1,
        perPage: number = this.perPage
    ) {
        const { data } = await this.searchClient.search({
            fields: this.fields,
            langs: ['fr'],
            page,
            page_size: perPage,
            q: query,
        })

        if (!data) {
            throw new Error('Error searching products')
        }

        return {
            data: data.hits.map((p) => this.productDTO(p)),
            meta: {
                total: data.count,
                perPage: data.page_size,
                currentPage: data.page,
            },
        }
    }

    public async getCategories() {
        const data = await this.client.getCategories()

        return Object.entries(data)
            .filter(
                ([key, value]: [string, any]) =>
                    key.startsWith('en:') &&
                    (!value.parents || value.parents.length === 0) &&
                    value.name?.fr
            )
            .map(([key, value]: [string, any]) => ({
                tag: key,
                name: value.name.fr,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }

    private productDTO(p: any) {
        return {
            barcode: p.code,
            name: p.product_name,
            brand: Array.isArray(p.brands) ? p.brands[0] : p.brands,
            categories: p.categories,
            imageUrl: p.image_url,
            servingSize: p.serving_quantity,
            servingSizeUnit: p.serving_quantity_unit,
            nutriments: p.nutriments,
            nutriScore: p.nutriscore_grade,
        }
    }
}
