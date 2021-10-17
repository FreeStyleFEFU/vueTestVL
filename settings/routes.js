'use strict'

module.exports = (app) => {
    const indexController = require('./../controllers/indexController')
    const postsController = require('./../controllers/postsController')

    app.route('/').get(indexController.index)
    app.route('/posts').get(postsController.posts)
}