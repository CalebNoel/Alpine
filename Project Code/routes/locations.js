/*
***********LOCATIONS ROUTE**********
TO DO:
1. Import Google Cloud Locations API using axios
2. Parse JSON return message and explicitly define parameters
3. Output to variable ID : "locations-stack"

***********************************
*/
var request = require('request');
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
    var api_key_mr = 'anrq8vQP315Q7JOrxaiDSUCewWHI59Ky';
    var api_key_owm = '4d95ccede70c9f544887073232cdc06f';

    var loggedIn = req.isAuthenticated();
    console.log(address);
    if(address) {
      axios({
        url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${address}&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,geometry,price_level,rating&locationbias=circle:6254@39.635757,-106.362984&key=${api_key}`,
          method: 'GET',
          dataType:'json',
        })
          .then(locations => {
              let locs = locations.data.candidates;
              let weather = []
              let elevation = []
              locs.forEach((element,index) => {
                weather[index] = axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${element.geometry.location.lat}&lon=${element.geometry.location.lng}&metrics=imperial&appid=${api_key_owm}`);
                // elevation[index] = axios.get(`http://open.mapquestapi.com/elevation/v1/profile?key=${api_key_mr}&shapeFormat=raw&latLngCollection=${element.geometry.location.lat},${element.geometry.location.lng}`);
              });
              axios.all(weather).then(axios.spread((...responses) => {
                responses = responses.map(response => response.data);
                console.log(responses);
                res.render('pages/locations', {
                  places: locs,
                  weather_for_places: responses,
                  numLoc: 0,
                  loggedIn: loggedIn
                });
              }));
          })
          .catch(error => {
            console.log(error);
            res.render('pages/locations',{
              places:null,
              weather_for_places: null,
              elevation_for_places: null,
              message: 'Error',
              loggedIn: loggedIn
            })
          });
    }
    else {
      req.session.message = "The Locations API is not working right now"
      res.redirect('/');
    }
  });

  module.exports = router;
