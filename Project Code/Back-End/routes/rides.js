const express = require('express');
const router = express.Router();
const { Ride } = require('../models/ride');
const { body,check, validationResult } = require('express-validator');


// router.get('/create',async(req,res) => {
//     res.render('')
// });

router.get('/search',async (req,res) => {
    res.render('/../../Front-End/views/Register.html')
});

router.post('/search',[
    check('query').not().isEmpty(),
],
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('/rides/search', {
                alert
            })
        } else {
          
        }
    });


// router.get('/',async (req,res) => {
//     res.render()
// });

module.exports = router;