const LocalStrategy = require('passport-local').Strategy
var User = require('../models').User;
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username,password,done){
        User.findOne({
            where: {
                email: {
                    [Op.eq]: username
                }
            }
        }).then(user => {
            if (!user) {
                return done(null, false, { message: 'No user found' });
            }
            // Match Password
            bcrypt.compare(password,user.dataValues.password).then((result)=>{
                if (result) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Wrong password' });
                }
            }).catch((err)=>console.error(err))
        }).catch(err => {
            if(err) throw err;
        })
    }));

    passport.serializeUser(function(user,done){
        done(null,user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findByPk(id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            } 
        });
    });
}