const express = require('express');
const Idea = require('../model/Idea');
const { ensureAuthenticated } = require('../helpers/auth')
const router = express.Router();

//Load Idea form
router.get('/add', ensureAuthenticated,  (req, res) => {
 res.render('ideas/add');
})
//Register idea's form inputs
router.post('/', ensureAuthenticated, (req, res) => {
    let {title, details} = req.body;
    let err = []
    if(!title){
        err.push({text: 'Please add a title'})
    }
    if(!details){
        err.push({text: 'Please add some details'})
    }
    if(err.length > 0) {
        res.render('ideas/add', {
            err,
            title,
            details,
        })
    }else {
        const newUser = {
            title, 
            details,
            user: req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'Idea successfully added!')
            res.redirect('/ideas')
        })
    }
})

//Show ideas
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas
        });
    });
});

//Show ideas to update
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id) {
            req.flash("error_msg", "Not Authorized")
            res.redirect('/ideas')
        }else {
            res.render('ideas/edit', {
                idea
            })
        }
    })
    
})

//Update ideas
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //Set new values
        idea.title =  req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Idea successfully updated!')
            res.redirect('/ideas')
        })
    })
})

//Delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.deleteOne({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Idea successfully removed!')
        res.redirect('/ideas')
    })
})

module.exports = router;
