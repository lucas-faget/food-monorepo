import { OpenFoodFacts, SearchApi } from '@openfoodfacts/openfoodfacts-nodejs'

export default class OpenFoodFactsService {
    private fields = ['code', 'product_name', 'brands', 'categories', 'image_url', 'nutriments']
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

    public productDTO(p: any) {
        return {
            barcode: p.code,
            name: p.product_name,
            brand: Array.isArray(p.brands) ? p.brands[0] : p.brands,
            categories: p.categories,
            imageUrl: p.image_url,
            nutriments: p.nutriments,
        }
    }
}
