const express = require('express');
const router = express.Router();
var Ride = require('../models').Ride;
var RideUser = require('../models').RideUser;
var User = require('../models').User;
var Destination = require('../models').Destination;
const { check, validationResult } = require('express-validator');
const ensureAuthenticated = require("./auth")
var path = require('path')
const { Op } = require("sequelize")
const moment = require("moment")

router.get('/search',ensureAuthenticated,async (req,res) => {
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
],ensureAuthenticated,
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const alert = errors.array()
            res.render('/rides/rideSearch', {
                alert
            })
        } else {
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
            console.log(req.body.start_date,req.body.end_date);
            var start_date = moment(req.body.start_date);
            var end_date = moment(req.body.end_date);
            var dest_id = parseInt(req.body.destination);
            console.log(start_date,end_date);
            const rides = await Ride.findAll({
                where: {
                    departure: {
                        [Op.gte] : start_date.format(),
                        [Op.lt] : end_date.format(),
                    },
                    end_date: {
                        [Op.gt] : start_date.format(),
                        [Op.lte] : end_date.format(),
                    },
                    dest_id: {
                        [Op.eq] : dest_id
                    }
                },
                include: [
                    {model: User, as: 'user',}, 
                    {model: Destination, as: 'dest'}
                ], 
            });
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
router.get('/',ensureAuthenticated,async (req,res) => {
    const driven_rides = await Ride.findAll({
        where: {
            driver_id: req.user.id,
        }
    });
    const rides = await RideUser.findAll({
        where: {
            user_id: req.user.id
        },
        include: [
            {model:Ride,as: 'ride'},
            {model:Destination,as: 'dest'}
        ]
    });
    res.render('pages/rides',{
        driven_rides: driven_rides,
        rides: rides,
    });
});


// Add Ride
router.get('/add',ensureAuthenticated,async (req,res) => {
    let destinations = await Destination.findAll();
    destinations = destinations.map(element => element.dataValues);
    res.render('pages/add_ride',{
        destinations: destinations
    });
});



router.post('/add',[
    check('start_date').not().isEmpty(),
    check('end_date').not().isEmpty(),
    check('origin'),
    check('destination'),
    check('seats'),
    check('car_model'),
    check('fare_share'),
],ensureAuthenticated,
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const alert = errors.array()
            res.render('/rides/add', {
                alert
            })
        } else {
            const start_date = moment(req.body.start_date).format();
            const end_date = moment(req.body.end_date).format();
            const newRide = await Ride.create({
                departure: start_date,
                end_date: end_date,
                fare_share: parseFloat(req.body.fare_share),
                car_model: req.body.car_model,
                seats_available : parseInt(req.body.seats),
                driver_id: req.user.id,
                dest_id: parseInt(req.body.destination),
                driver_rating: 0,
            });
            newRide.save();
            res.redirect(`/rides/${newRide.id}`,{
                message : 'Added ride successfully'
            });
        }
    }
);


// Edit Ride
router.get('/:id',ensureAuthenticated,async (req,res) => {
    const ride = await Ride.findAll({
        where: {
            id: req.params.id,
        },
        include: [
            {model:Destination,as: 'dest'}
        ]
    });
    res.render('pages/ride',{
        ride
    });
});

router.put('/edit/:id',[
    check('start_date').not().isEmpty(),
    check('end_date').not().isEmpty(),
    check('origin'),
    check('destination'),
    check('seats'),
    check('car_model'),
    check('fare_share'),
    check('driver_rating')
],ensureAuthenticated,
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
                driver_id: req.user.id,
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
router.delete('/delete/:id',ensureAuthenticated,async (req,res) => {
    let rows_deleted = await RideUser.destroy({
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

module.exports = router;