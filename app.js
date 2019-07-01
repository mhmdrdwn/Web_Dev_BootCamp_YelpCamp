var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var seedDB = require("./seeds")
var passport = require("passport")
var LocalStrategy = require("passport-local")
User = require("./models/user")
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname +"/public"))
app.use(require("express-session")({
	secret:"Once again",
	resave : false,
	saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req, res, next){
	res.locals.currentUser = req.user
	next()
})
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
mongoose.connect("mongodb://localhost:27017/yelpcamp")
seedDB();

var campgrounds=[
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
	{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
	{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
	{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
]
app.get("/", function(req,res){
	res.render("landing")
})

// INDEX Route - Display all entries inm database
app.get("/campgrounds", function(req,res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err)	
		}else{
			res.render("campgrounds/index", { campgrounds : campgrounds, currentUser : req.user})
		}
	})
})

// NEW Route - show form to create new item
app.get("/campgrounds/new", function(req,res){
	res.render("campgrounds/new")	
})

// CREATE Route - adding new item to database
app.post("/campgrounds", function(req,res){
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var newCampground={name:name, image:image, description:description}
	//campground.push(newCampground)
	Campground.create(newCampground, function(err,campground){
		if(err){
			console.log(err)	
		}else{
			console.log("anew entry created")
			console.log(campground)
			res.redirect("/campgrounds")
		}
	})
})

//SHOW Route - show one item
app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/show",{campground: foundCampground})
		}
	})
})

// Comments routes
// NEW Route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}else{
			res.render("comments/new", {campground : campground})
		}
	})

})

//
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
			res.redirect("/campgrounds")	
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				}else{
					campground.comments.push(comment)
					campground.save()
					res.redirect("/campgrounds/"+campground._id)

				}
			})	
		}	
	})
})

//AUTH Routes
// SHOW sign up
app.get("/register", function(req, res){
	res.render("register")
})
// sign up auth
app.post('/register', function(req, res){
	var newUser = new User({username: req.body.username}); // Note password NOT in new User
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

// SHOW login 
app.get("/login", function(req,res){
	res.render("login")
})

// log in auth
app.post("/login", passport.authenticate("local",{successRedirect:"/campgrounds", failureRedirect:"/login"}), function(req, res){ 
}); 

// logout auth
app.get("/logout", function(req, res){
	req.logout()
	res.redirect("/campgrounds")
})

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}else{
		res.redirect("/login")
	}
}

app.listen(3000, function(){
	console.log("server is up")	 
})
