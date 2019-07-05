var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var seedDB = require("./seeds")
var passport = require("passport")
var LocalStrategy = require("passport-local")

var campgroundsRoutes = require("./routes/campgrounds")
var commentsRoutes = require("./routes/comments")
var indexRoutes = require("./routes/index")
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

app.use("/",indexRoutes)
app.use("/campgrounds",campgroundsRoutes)
app.use("/campgrounds/:id/comments",commentsRoutes)

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
mongoose.connect("mongodb://localhost:27017/yelpcamp")
seedDB();


app.listen(3000, function(){
	console.log("server is up")	 
})
