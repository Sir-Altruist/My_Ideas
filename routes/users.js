const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User model
const User = require('../model/Users')

//@desc GET(load) login page
//@access Public
router.get('/register', (req, res) => {
    res.render('users/register')
})

//Enable user registeration
router.post('/register', (req, res) => {
    let err = []
    let { name, email, password, confirm } = req.body;
    if(!name || !email || !password || !confirm){
        err.push({text: 'Enter all credentials'})
    }
    if(password.length < 8){
        err.push({text: 'Password length must not be less than 8 characters'})
    }
    if(password !== confirm) {
        err.push({text: 'Passwords do not match'})
    }
    if(err.length > 0){
        res.render('users/register', {
            err,
            name,
            email,
            password,
            confirm
        })
    }else {
        //checks if email already exists
        User.findOne({email})
        .then(user => {
            if(user){
                req.flash('error_msg', `Email has already been taken`)
                res.redirect('/users/register')
            }else { 
                const newUser = new User({
                    name,
                    email,
                    password
                })
                //Hash users password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;

                        //Save new user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', `You've been successfully registered and can now log in`)
                            res.redirect('/users/login')
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    })
                })
            }
        })
    }
})

//@desc GET(load) login page
//@access Public
router.get('/login', (req, res) => {
    res.render('users/login')
})

//Enable user login with Authentiication
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//@desc GET: Log users out
//@access private
router.get('/logout', (req, res) => {
    req.logout()
    req.flash("success_msg", "You've been successfully logged out!")
    res.redirect('/users/login')
})

module.exports = router;