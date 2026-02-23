import { OpenFoodFacts, SearchApi } from '@openfoodfacts/openfoodfacts-nodejs'

export default class OpenFoodFactsService {
    private fields = ['code', 'product_name', 'brands', 'categories', 'image_url', 'nutriments']
    private pageSize: number = 20

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

        if (!data) {
            throw new Error(error.result.name)
        }

        return data.product
    }

    public async searchProduct(query: string = '', page = 1) {
        const { data } = await this.searchClient.search({
            fields: this.fields,
            langs: ['fr'],
            page,
            page_size: this.pageSize,
            q: query,
        })

        if (!data) {
            throw new Error('Error searching products')
        }

        return {
            page: data.page,
            page_count: data.page_count,
            page_size: data.page_size,
            count: data.count,
            products: data.hits,
        }
    }
}
