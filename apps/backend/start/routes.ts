/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

const FoodController = () => import('#controllers/food_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/food/:barcode', [FoodController, 'getProduct'])
router.get('/food', [FoodController, 'search'])
router.resource('products', ProductsController).apiOnly()

router.get('/swagger', async () => {
    return AutoSwagger.default.docs(router.toJSON(), swagger)
})
router.get('/docs', async () => {
    return AutoSwagger.default.ui('/swagger', swagger)
})
