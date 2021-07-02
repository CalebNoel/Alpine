const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username,password,done){
        User.findOne({
            where: {
                name: {
                    [Op.eq]: username
                }
            }
        }).then(user => {
            if (!user) {
                return done(null, false, { message: 'No user found' });
            }
    
            // Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Wrong password' });
            }
            });
        }).catch(err => {
            if(err) throw err;
        })
    }));

    passport.serializeUser(function(user,done){
        done(null,user.id)
    })

    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user)
        })
    })
}