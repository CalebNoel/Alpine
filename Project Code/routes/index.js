const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/',async (req,res)=>{
    res.render('pages/HomeMain');
});

router.get('/map',async (req,res) => {
    res.render('pages/map');
});

router.get('/about',async (req,res)=>{
    res.render('pages/about')
});
// router.get('/dashboard',(req,res)=>{
    // res.render('dashboard')
// })

module.exports = router
