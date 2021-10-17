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


exports.add = (req, res) => {

    const sql = "INSERT INTO `checked_posts`(`status`, `comment`, `postId`) VALUES('" + req.body.status + "', '" + req.body.comment + "', '" + req.body.postId + "')"
    db.query(sql, (error, results) => {
        if(error) {
            console.log(error);
        } else {
            response.status(results, res);
        }
    })

    console.log(req.body);
}