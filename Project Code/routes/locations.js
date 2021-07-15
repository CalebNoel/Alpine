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



router.post('/get_locations', function(req, res) {
    var address = req.body.address; 
    var api_key = 'AIzaSyBc_Gve26-zN7gZ5vyexxdSROceiVKvaas'; 
    if(address) {
      axios({
        url: `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap`,
          method: 'GET',
          dataType:'json',
        })
          .then(locations => {
            res.render('/locations', {
              locations: '',
              numLoc: 0
            });
          })
          .catch(error => {
            res.render('/locations',{
              locations: '',
              numLoc : 0,
              message: 'Error'
            })
          });
  
  
    }
    else {
      res.render('/', {
        message: 'Locations API is not working right now.'
      });
    }
  });

  module.exports = router;