const express = require('express')
const cors = require('cors')
const app = express()
const port = 3500
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors({ origin: ['http://localhost:8080'], }))

const routes = require('./settings/routes')
routes(app)

app.listen(port, () => {
    console.log(`App listen on port ${port}`)
})