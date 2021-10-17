'use strict'

const response = require('./../response')
const db = require('./../settings/db')

exports.posts = (req, res) => {

    // eslint-disable-next-line no-unused-vars
    db.query('SELECT * FROM `posts`', (error, rows, fields) => {
        if(error) {
            console.log(error)
        } else {
            response.status(rows, res)
        }
    })

}