const express = require('express');
const router = express.Router();
const { Ride } = require('../models/ride');
const { check, validationResult } = require('express-validator');
var path = require('path')

// router.get('/create',async(req,res) => {
//     res.render('')
// });

router.get('/search',ensureAuthenticated,async (req,res) => {
    res.sendFile(path.join(__dirname+ "/../../Front-End/views/rideSearch.html"))
});

router.post('/search',ensureAuthenticated,[
    check('query').not().isEmpty(),
],
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
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


// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
        res.redirect('/users/login');
    }
  }

module.exports = router;