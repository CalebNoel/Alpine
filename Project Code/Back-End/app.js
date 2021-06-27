const express = require('express')
const connectDB = require('./config/db')
const exphbs = require('express-handlebars')
const session = require('express-session')
const path = require('path')

dotenv.config({ path: './config/config.env'})

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))


const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))