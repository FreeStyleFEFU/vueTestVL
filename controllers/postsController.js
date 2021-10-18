'use strict'

const response = require('./../response')
const db = require('./../settings/db')

exports.posts = (req, res) => {

    // eslint-disable-next-line no-unused-vars
    db.query("SELECT * FROM `posts` LIMIT " + req.query.limit + " OFFSET " + req.query.offset, (error, rows, fields) => {
        if(error) {
            console.log(error)
        } else {
            response.status(rows, res)
        }
    })

}


exports.add = (req, res) => {

    let values = req.body.reduce((acc, value, idx) => acc + `('${ value.status }', '${ value.comment }', '${ value.postId }')${ idx === req.body.length - 1 ? '' : ', '}`, '')

    const sql = "INSERT INTO `checked_posts`(`status`, `comment`, `postId`) VALUES" + values
    db.query(sql, (error, results) => {
        if(error) {
            console.log(error);
        } else {
            response.status(results, res);
        }
    })
}