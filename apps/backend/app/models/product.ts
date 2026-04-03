import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare barcode: string | null

    @column()
    declare name: string

    @column()
    declare brand: string | null

    @column()
    declare categories: string | null

    @column({ columnName: 'image_url' })
    declare imageUrl: string | null

    @column()
    declare nutriments: Record<string, number | string> | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
