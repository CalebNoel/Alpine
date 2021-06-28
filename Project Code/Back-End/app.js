const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const morgan = require('morgan')
const dotenv = require('dotenv')

const db = require('./models/index.js')


dotenv.config({ path: './config/config.env'})

const app = express()


app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Routes
app.use('/',require('./routes/index'))

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))