const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

//User model
const User = require('../model/Users')

module.exports = (passport) => {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        //Match user ( find user by the user registered email)
        User.findOne({email})
        .then(user => {
            if(!user){
                return done(null, false, {message: 'User does not exist!'})
            }

            //Match user password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user)
                }else {
                    return done(null, false, {message: 'Password Incorrect!'}) 
                }
            })
            
        })
    }))

    //Constantly authenticate user when logged in
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}