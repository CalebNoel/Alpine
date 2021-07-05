const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const morgan = require('morgan')
const passport = require('passport');
const session = require('express-session');

// const dotenv = require('dotenv')

const db = require('./models/index.js')

// dotenv.config({ path: './config/config.env'})

const app = express()
let users = require('./routes/users');
let rides = require('./routes/rides');
let chat = require('./routes/chat');

app.set('view engine', 'ejs')

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(__dirname + '/resources'));

require('./middleware/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/',require('./routes/index'))
app.use('/users', users);
app.use('/rides', rides);
app.use('/chat', chat);

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
