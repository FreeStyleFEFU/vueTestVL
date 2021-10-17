const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'testvl',
})

connection.connect((error) => {
    if(error) {
        return console.log('Ошибка подключения к БД')
    } else {
        return console.log('Подключение успешно')
    }
})

module.exports = connection