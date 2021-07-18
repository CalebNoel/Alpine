/*
***********LOCATIONS ROUTE**********
TO DO:
1. Import Google Cloud Locations API using axios
2. Parse JSON return message and explicitly define parameters
3. Output to variable ID : "locations-stack"

***********************************
*/
const express = require('express');
const router = express();
const ensureAuthenticated = require("./auth")
const path = require('path')
const axios = require('axios');
const qs = require('query-string');
const { Op } = require("sequelize")


var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
router.use(bodyParser.json());              // Support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies

// Set the view engine to ejs
router.set('view engine', 'ejs');
router.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier

router.get('/', function(req, res) {
  var loggedIn = req.isAuthenticated();
  res.render('pages/locations', {
      places: null,
      loggedIn: loggedIn
  });
});

router.post('/get_locations', function(req, res) {
    var address = req.body.place; 
    var api_key = 'AIzaSyDPSOpMS_xDzRDg50J8ee34DTdmHQOkUj0'; 
    var loggedIn = req.isAuthenticated();
    if(address) {
      axios({
        url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${address}&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:6254@39.635757,-106.362984&key=${api_key}`,
          method: 'GET',
          dataType:'json',
        })
          .then(locations => {
            console.log(locations.candidates)
            res.render('pages/locations', {
              places: locations.candidates,
              numLoc: 0,
              loggedIn: loggedIn
              
            });
          })
          .catch(error => {
            res.render('pages/locations',{
              message: 'Error',
              loggedIn: loggedIn
            })
          });
  
  
    }
    else {
      res.render('/', {
        message: 'Locations API is not working right now.',
        loggedIn: loggedIn
      });
    }
  });

  module.exports = router;
