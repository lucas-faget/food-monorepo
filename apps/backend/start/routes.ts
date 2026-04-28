/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { openapi } from '../docs/openapi.js'

router.get('/openapi.json', async () => {
    return openapi
})

router.get('/docs', async () => {
    return `
        <!doctype html>
        <html>
            <head>
                <title>API Docs</title>
            </head>
            <body>
                <div id="scalar"></div>

                <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
                <script>
                    Scalar.createApiReference('#scalar', {
                        url: '/openapi.json'
                    })
                </script>
            </body>
        </html>
    `
})

router.get('/', () => {
    return { hello: 'world' }
})

router
    .group(() => {
        router
            .group(() => {
                router.post('signup', [controllers.NewAccount, 'store'])
                router.post('login', [controllers.AccessTokens, 'store'])
            })
            .prefix('auth')
            .as('auth')

        router
            .group(() => {
                router.get('profile', [controllers.Profile, 'show'])
                router.post('logout', [controllers.AccessTokens, 'destroy'])
            })
            .prefix('account')
            .as('profile')
            .use(middleware.auth())
    })
    .prefix('/api/v1')

/* Food */
router.get('/food/:barcode', [controllers.Food, 'getProduct'])
router.get('/food', [controllers.Food, 'search'])
/* Products */
router.resource('products', controllers.Products).apiOnly()
/* Categories */
router.get('/categories', [controllers.Categories, 'index'])
