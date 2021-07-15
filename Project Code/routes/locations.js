/*
***********LOCATIONS ROUTE**********

TO DO:
1. Import Google Cloud Locations API using axios
2. Parse JSON return message and explicitly define parameters
3. Output to variable ID : "locations-stack"

***********************************
*/

const router = express.Router()
const ensureAuthenticated = require("./auth")
const path = require('path')

var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());              
app.use(bodyParser.urlencoded({ extended: true }));  
const axios = require('axios');
const qs = require('query-string');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));


app.post('/get_locations', function(req, res) {
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
              numLoc = 0,
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