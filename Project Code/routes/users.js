const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
var User = require('../models').User;
const path = require('path')
const { body,check, validationResult } = require('express-validator');
const ensureAuthenticated = require("./auth")
const moment = require("moment")
const { Op } = require("sequelize")

var authUser;

// Register Form
router.get('/register', async (req, res) => {
    res.render('pages/Register', {
      loggedIn: false
    })
});

router.post('/register', [
  check('fullName','This username must me 3+ characters long').not().isEmpty().isLength({ min: 3 }),
  check('emailAddress','Please enter a validate email')
    .not().isEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Email is not valid')
    .normalizeEmail().custom(value => {
      return User.findOne({where:{email:value}}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
  check('PhoneNumber','Please enter a validate email')
    .not().isEmpty().withMessage('Phone number cannot be empty')
    .isMobilePhone().withMessage('Phone number not valid'),
  check('passwordFirst')
    .not().isEmpty().withMessage('Email cannot be empty')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0})
    .withMessage('Password not strong enough: Should be of length 8 with 1 Lowercase,1 Uppercase and 1 Symbol'),
  check('passwordConfirm').not().isEmpty().withMessage('Confirm Password cannot be empty').custom((value, { req }) => {
    if (value !== req.body.passwordFirst) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  check('dob','Please enter a valid Date of Birth').optional().isDate()
],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        alert = errors.errors;
        console.log(alert);
        res.render('pages/Register', {
            alert
        })
    } else {
      const gender = null;
      const salt = await bcrypt.genSalt(10);
      const dob = moment(req.body.dob);
      console.log(req.body);
      const newUser = await User.create({
        name: req.body.fullName,
        email: req.body.emailAddress,
        password: req.body.passwordFirst,//await bcrypt.hash(req.body.passwordFirst, salt),
        phone_no: req.body.PhoneNumber,
        dob : dob.format(),
        user_rating: 0.0,
      });
      newUser.save();
      req.session.message = 'Registered Successfully, please login';
      res.redirect('/users/login');
  }
});


// Login Form
router.get('/login', async (req, res) => {
    res.render('pages/User_Login', {
      loginError: '',
      loggedIn: false
    });
});

// Login Process
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next);
  // targetUser = await User.findOne({where:{email: req.body.username}});
  // if (targetUser != null) {
  //   if (req.body.password == targetUser.password) {
  //     authUser = req.body.username;
  //     console.log(req.body.username, " is logged in");
  //     res.redirect('/');
  //   }
  //   else {
  //     res.render('pages/User_Login', {
  //       loginError: 'Incorrect password!'
  //     })
  //   }
  // }
  // else {
  //   res.render('pages/User_Login', {
  //     loginError: 'Incorrect username!'
  //   })
  // }

});

// logout
router.get('/logout', ensureAuthenticated,async (req, res) => {
  req.logout();
  res.redirect('/users/login',{
    message : 'You are logged out',
    loggedIn: false
  });
});

router.get('/profile',async (req,res)=>{
  if(ensureAuthenticated(res, req, next)) {
    console.log(req);
  const curr_user = await User.findOne({
    where:{
      id: req.user.id
    }
  });
  res.render('pages/MyAccount',{
    user: curr_user, //replace with req.user
  })
  }
  
})

router.post('/profile',[
  check('fullName','This username must me 3+ characters long').not().isEmpty().isLength({ min: 3 }),
  check('emailAddress','Please enter a validate email')
    .not().isEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Email is not valid')
    .normalizeEmail().custom((value, { req })  => {
      return User.findOne({where:{
        email:value,
        id: {
          [Op.ne] : 1 //replace with req.user.id
        }
      }}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
  check('PhoneNumber','Please enter a validate email')
    .not().isEmpty().withMessage('Phone number cannot be empty')
    .isMobilePhone().withMessage('Phone number not valid'),
  check('passwordFirst')
    .optional(),
  check('passwordConfirm').optional().custom((value, { req }) => {
    if (value !== req.body.passwordFirst) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  check('dob','Please enter a valid Date of Birth').optional().isDate()
],async (req,res)=>{
  
  const errors = validationResult(req)
    if(!errors.isEmpty()) {
        alert = errors.errors;
        console.log(alert)
        res.render('pages/MyAccount', {
            alert
        })
    } else {
      const salt = await bcrypt.genSalt(10);
      const dob = moment(req.body.dob);
      const update_user = await User.update({
        name: req.body.fullName,
        email: req.body.emailAddress,
        password: req.body.passwordFirst ? await bcrypt.hash(req.body.passwordFirst, salt) : '$2b$10$/VvxXqQiEMsNhLFNkVLebe2gBH9T2VnI0f8t9fjqiLGfGxMwhbpnq', //replace with req.user.password
        phone_no: req.body.PhoneNumber,
        dob : dob ? dob.format() : new Date('10 Jul 1999'), //replace with req.user.dob
      },{
        where: {
          id: 1 //replace with req.user.id
        }
      });
      req.session.message = 'Edited Successfully, please login';
      res.redirect('/users/profile',);
    }
})

module.exports = router;
