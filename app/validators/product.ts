import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
    vine.object({
        barcode: vine.string().trim().nullable().optional(),
        name: vine.string().trim(),
        brand: vine.string().trim().nullable().optional(),
        categories: vine.string().trim().nullable().optional(),
        imageUrl: vine.string().trim().url().nullable().optional(),
        nutriments: vine
            .record(vine.unionOfTypes([vine.number(), vine.string()]))
            .nullable()
            .optional(),
    })
)

export const updateProductValidator = vine.compile(
    vine.object({
        barcode: vine.string().trim().nullable().optional(),
        name: vine.string().trim().optional(),
        brand: vine.string().trim().nullable().optional(),
        categories: vine.string().trim().nullable().optional(),
        imageUrl: vine.string().trim().url().nullable().optional(),
        nutriments: vine
            .record(vine.unionOfTypes([vine.number(), vine.string()]))
            .nullable()
            .optional(),
    })
)
