/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const FoodController = () => import('#controllers/food_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/food/:barcode', [FoodController, 'show'])
router.get('/food', [FoodController, 'search'])
router.resource('products', ProductsController).apiOnly()
