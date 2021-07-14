const express = require('express');
const router = express.Router();
var Ride = require('../models').Ride;
var RideUser = require('../models').RideUser;
var RideRate = require('../models').RideRate;
var User = require('../models').User;
var Destination = require('../models').Destination;
const { check, validationResult } = require('express-validator');
const ensureAuthenticated = require("./auth")
var path = require('path')
const { Op } = require("sequelize")
const moment = require("moment")

router.get('/search',async (req,res) => {
    let destinations = await Destination.findAll();
    destinations = destinations.map(element => element.dataValues);
    res.render('pages/rideSearch',{
        rides: null,
        destinations: destinations
    });
});

router.post('/search',[
    check('start_date').not().isEmpty(),
    check('end_date').not().isEmpty(),
    check('origin'),
    check('destination'),
],
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const alert = errors.array()
            console.log(alert);
            res.render('pages/rideSearch', {
                alert
            })
        } else {
            
            var start_date = moment(req.body.start_date);
            var end_date = moment(req.body.end_date);
            var dest_id = parseInt(req.body.destination);
            const where_clause = {
                departure: {
                    [Op.gte] : start_date.toDate(),
                    [Op.lt] : end_date.toDate(),
                },
                end_date: {
                    [Op.gt] : start_date.toDate(),
                    [Op.lte] : end_date.toDate(),
                },
            };
            console.log(req.body.origin);
            console.log(req.body.destination);
            if(req.body.origin != ''){
                var searchTerm = req.body.origin;
                // Tokenize the search terms and remove empty spaces
                var tokens = searchTerm
                            .toLowerCase()
                            .split(' ')
                            .filter(function(token){
                                return token.trim() !== '';
                            });
                var searchTermRegex = null;
                if(tokens.length) {
                    searchTermRegex = new RegExp(tokens.join('|'), 'gim');
                }
                where_clause.start_point = {[Op.regexp] : searchTermRegex};
            }
            if(req.body.destination != ''){
                where_clause.dest_id = {[Op.eq] : parseInt(req.body.destination)};
            }
            const rides = await Ride.findAll({
                where: where_clause,
                include: [
                    {model: User}, 
                    {model: Destination}
                ], 
            });
            console.log(rides);
            let destinations = await Destination.findAll();
            destinations = destinations.map(element => element.dataValues);
            res.render('pages/rideSearch',{
                rides: rides,
                destinations: destinations
            });
        }
    }
);

// Ride Dashboard
router.get('/',async (req,res) => {
    const driven_rides = await Ride.findAll({
        where: {
            driver_id: 1, //replace with req.user.id
        }
    });
    const rides = await RideUser.findAll({
        where: {
            user_id: 1 //replace with req.user.id
        },
        include: [
            {model:Ride},
        ]
    });
    res.render('pages/rides',{
        driven_rides: driven_rides,
        rides: rides,
    });
});


// Add Ride
router.get('/add',async (req,res) => {
    let destinations = await Destination.findAll();
    destinations = destinations.map(element => element.dataValues);
    res.render('pages/add_ride',{
        destinations: destinations
    });
});



router.post('/add',[
    check('depart_date').not().isEmpty().isAfter(),
    check('return_date').not().isEmpty().custom((value, { req }) => {
        if (moment(value).toDate() <= moment(req.body.depart_date).toDate()) {
          throw new Error('Return Date can\'t be before departure');
        }
        return true;
      }),
    check('origin').not().isEmpty(),
    check('destination').not().isEmpty(),
    check('seats').not().isEmpty().isInt(),
    check('car_make'),
    check('car_model'),
    check('fare_share'),
],
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const alert = errors.array()
            console.log(alert);
            let destinations = await Destination.findAll();
            destinations = destinations.map(element => element.dataValues);
            res.render('/pages/add_ride', {
                destinations: destinations,
                error: alert
            });
        } else {
            
            const start_date = moment(req.body.start_date);
            const end_date = moment(req.body.end_date);
            const newRide = await Ride.create({
                departure: start_date.toDate(),
                start_point: req.body.origin,
                end_date: end_date.toDate(),
                fare_share: req.body.fare_share != '' ? req.body.fare_share : null,
                vehicle_make: req.body.vehicle_make != '' ? req.body.vehicle_make : null,
                vehicle_model: req.body.vehicle_model != '' ? req.body.vehicle_model : null,
                seats_available : parseInt(req.body.seats),
                driver_id: 1, //replace with req.user.id
                dest_id: parseInt(req.body.destination),
                
            });
            newRide.save();
            req.session.message = 'Added ride successfully';
            res.redirect(`/rides/${newRide.id}`);
        }
    }
);


router.get('/:id',async (req,res) => {
    const ride = await Ride.findOne({
        where: {
            id: {
                [Op.eq]:req.params.id

            }
        },
        include: [
            {model:Destination}
        ]
    });
    let destinations = await Destination.findAll();
    destinations = destinations.map(element => element.dataValues);
    console.log(ride)
    res.render('pages/ride',{
        ride: ride.dataValues,
        destinations: destinations
    });
});

// Edit Ride
router.post('/edit/:id',[
    check('depart_date').not().isEmpty().isAfter(),
    check('return_date').not().isEmpty().custom((value, { req }) => {
        if (moment(value).toDate() <= moment(req.body.depart_date).toDate()) {
          throw new Error('Return Date can\'t be before departure');
        }
        return true;
      }),
    check('origin').not().isEmpty(),
    check('destination').not().isEmpty(),
    check('seats').not().isEmpty().isInt(),
    check('car_make'),
    check('car_model'),
    check('fare_share'),
],
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const alert = errors.array()
            res.render('/rides/add', {
                alert
            });
        } else {
            
            const start_date = moment(req.body.start_date).format();
            const end_date = moment(req.body.end_date).format();
            const newRide = await Ride.update({
                departure: start_date,
                end_date: end_date,
                fare_share: parseFloat(req.body.fare_share),
                car_model: req.body.car_model,
                seats_available : parseInt(req.body.seats),
                driver_id: 1, //replace with req.user.id
                dest_id: parseInt(req.body.destination),
                driver_rating: parseInt(req.body.driver_rating),
            },{
                where:{
                    id: req.params.id
                }
            });
            newRide.save();
            res.redirect(`/rides/${newRide.id}`,{
                message : 'Updated ride successfully'
            });
        }
    }
);

// Delete Ride
router.delete('/delete/:id',async (req,res) => {
    let cascade_delete = await RideUser.destroy({
        where: {
            ride_id: req.params.id
        }
    });
    let rows_deleted = await Ride.destroy({
        where: {
            id: req.params.id
        }
    });
    res.redirect(`/rides/`,{
        message : 'Deleted ride successfully'
    });
});

// Add Rating Routes
router.get('/:id/rate/:user_id',async(req,res) => {
    if(req.query.rating){
        const rating = req.query.rating;
        const ride_rating = await RideRate.findOne({
            where:{
                ride_id: {
                    [Op.eq] : parseInt(req.params.id)
                },
                ratee_id: {
                    [Op.eq] : parseInt(req.params.user_id)
                },
                rater_id: {
                    [Op.eq] : parseInt(1) // replace with req.user.id
                }
            }
        });
        if(!ride_rating){
            const new_rating = await RideRate.create({
                rating: rating,
                rater_id: 1, //replace with req.user.id
                ratee_id: req.params.user_id,
                ride_id: req.params.id
            });
            new_rating.save();
        } else {
            const new_rating = await RideRate.update({
                rating: rating
            },{
                where: {
                    id: {
                        [Op.eq] : ride_rating.id
                    }
                }
            });
        }
        res.redirect({
            message : 'Updated ride successfully'
        },`/rides/${req.params.id}`);
    } else{
        res.redirect({
            alter : { user_id: req.params.user_id, message:'Please assign a rating'}
        },`/rides/${req.params.id}`);
    }
});


module.exports = router;