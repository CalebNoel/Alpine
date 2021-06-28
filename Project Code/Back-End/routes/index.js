const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+ "/../views/User_Login.html"))
})

// router.get('/dashboard',(req,res)=>{
    // res.render('dashboard')
// })

module.exports = router