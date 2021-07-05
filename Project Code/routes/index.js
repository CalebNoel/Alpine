const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/',ensureAuthenticated,async (req,res)=>{
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/HomeMain.html"))
})

router.get('/map',ensureAuthenticated,async (req,res) => {
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/map.html"))
})

router.get('/map',ensureAuthenticated,async (req,res) => {
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/map.html"))
})

router.get('/about',async (req,res)=>{
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/about.html"));
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
      res.redirect('/users/login');
    }
}

// router.get('/dashboard',(req,res)=>{
    // res.render('dashboard')
// })

module.exports = router