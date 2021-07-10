const express = require('express')
const router = express.Router()
const ensureAuthenticated = require("./auth")
const path = require('path')

router.get('/',async (req,res)=>{
    res.render('pages/HomeMain')
})

router.get('/map',async (req,res) => {
    res.render('pages/map')
})

// router.get('/map',ensureAuthenticated,async (req,res) => {
//     res.sendFile(path.join(__dirname+ "/../../Front-End/views/map.html"))
// })

router.get('/about',async (req,res)=>{
    res.render('pages/about')
})

router.get('/locations',async (req,res)=>{
    res.render('pages/locations')
})





module.exports = router