import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'products'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.string('barcode').nullable().unique()
            table.string('name').notNullable()
            table.string('brand').nullable()
            table.string('categories').nullable()
            table.string('image_url').nullable()
            table.json('nutriments').nullable()

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
