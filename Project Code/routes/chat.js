const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
const { Model } = require('../models/user');
const path = require('path')

// router.get('/create',async(req,res) => {
//     res.render('')
// });

router.get('/', async (req,res) => {
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/chat.html"))
})

module.exports = router;
