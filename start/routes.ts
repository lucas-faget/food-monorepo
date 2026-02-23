/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import FoodController from '#controllers/food_controller'

router.get('/', async () => {
    return {
        hello: 'world',
    }
})

router.get('/food/:barcode', [FoodController, 'show'])
router.get('/food/search/:query/:page?', [FoodController, 'search'])
