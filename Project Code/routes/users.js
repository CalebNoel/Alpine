const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
const { User } = require('../models/user');
const path = require('path')
const { body,check, validationResult } = require('express-validator');
const ensureAuthenticated = require("./auth")



// Show Profile
router.get('/register', async (req, res) => {
  res.render('pages/Register')
});

// Register Form
router.get('/register', async (req, res) => {
    res.render('pages/Register')
});

router.post('/register', [
  check('fullName','This username must me 3+ characters long').not().isEmpty().isLength({ min: 3 }),
  check('emailAddress','Please enter a validate email')
    .not().isEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Email is not valid')
    .normalizeEmail(),
  check('PhoneNumber','Please enter a validate email')
    .not().isEmpty().withMessage('Phone number cannot be empty')
    .isMobilePhone().withMessage('Phone number not valid'),
  check('passwordFirst')
    .not().isEmpty().withMessage('Email cannot be empty')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0})
    .withMessage('Password not strong enough: Should be of length 8 with 1 Lowercase,1 Uppercase and 1 Symbol'),
  check('passwordConfirm').not().isEmpty().withMessage('Confirm Password cannot be empty').equals(body('passwordFirst')).withMessage('Passwords do not match'),
  check('Gender','Please select a valid option').optional().isIn(['male','female'])
],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const alert = errors.array()
        res.render('pages/Register', {
            alert
        })
    } else {
      const dob = null;
      const gender = null;
      const salt = await bcrypt.genSalt(10);
      const newUser = await User.create({
        name: req.body.fullName,
        email: req.body.emailAddress,
        password: await bcrypt.hash(req.body.passwrodFirst, salt),
        phone_no: req.body.PhoneNumber,
        dob : req.body.dob ? req.body.dob : dob,
        gender: req.body.gender ? req.body.gender : gender,
        user_rating: 0.0,
      });
      newUser.save();
      res.redirect('/users/login',{
        message : 'You have successfully registered, Please log in'
      });
  }
});


// Login Form
router.get('/login', async (req, res) => {
    res.render('pages/User_Login');
});

// Login Process
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next);
});

// logout
router.get('/logout', async (req, res) => {
  req.logout();
  res.redirect('/users/login',{
    message : 'You are logged out'
  });
});


module.exports = router;
