const express = require('express');
const router = express.Router();
var Ride = require('../models').Ride;
var User = require('../models').User;
var Destination = require('../models').Destination;
const { check, validationResult } = require('express-validator');
const ensureAuthenticated = require("./auth")
var path = require('path')
const { Op } = require("sequelize")


// router.get('/create',async(req,res) => {
//     res.render('')
// });

router.get('/search',ensureAuthenticated,async (req,res) => {
    res.render('/pages/rideSearch');
});

// router.get('/search/:search_query',ensureAuthenticated,[
//     check('query').not().isEmpty(),
// ],
//     async (req,res) => {
//         if(!errors.isEmpty()) {
//             const alert = errors.array()
//             res.render('/rides/rideSearch', {
//                 alert
//             })
//         } else {
//             const errors = validationResult(req)
//             rides = Ride.findAll({
//                 where: {
//                     [Op.or]: [
//                         {
//                             name: {
//                                 [Op.regexp] : searchTermRegex
//                             }
//                         },
//                         {
//                             address: {
//                                 [Op.regexp] : searchTermRegex
//                             }
//                         }
//                     ]
//                 },
//                 include: [
//                     {
//                         model: User,
//                         as: 'user',
//                     }, 
//                     {
//                         model: Destination,
//                         as: 'dest'
//                     }
//                 ], 
//             });
//             console.log();
//         }
//     });


// router.get('/',async (req,res) => {
//     res.render()
// });



module.exports = router;