const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/',async (req,res)=>{
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/HomeMain.html"))
})

router.get('/map',async (req,res) => {
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/map.html"))
})

router.get('/about',async (req,res)=>{
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/about.html"));
})
// router.get('/dashboard',(req,res)=>{
    // res.render('dashboard')
// })

module.exports = router