var express = require('express');
var router  = express.Router({mergeParams: true});
var passport = require('passport');
var User = require('../models/user');

//root Route
router.get("/", function(req, res){
    res.render("landing");
});


// Authentication


router.get('/register', function(req, res){
   res.render('register'); 
});

//handle sign-up auth
router.post('/register', function(req, res){
        var newUser = new User({username: req.body.username}); 
       User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect('/campgrounds');
            });
        }
    }); 
});

router.get('/login', function(req, res){
   res.render('login'); 
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
  
});


//logout auth
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
