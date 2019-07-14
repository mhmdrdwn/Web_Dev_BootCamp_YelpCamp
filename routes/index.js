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
            	req.flash("error", err.message)
		return res.redirect('/register');
        }else{
            passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome on board "+ user.username)
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
    req.flash("success", "You Logged Out")
    res.redirect('/login');
});


module.exports = router;
