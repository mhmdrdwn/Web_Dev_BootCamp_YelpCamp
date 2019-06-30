var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var seedDB = require("./seeds")
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/yelpcamp")
seedDB();

//Campground.create({
//	name : "Granite Hill", 
//	image : "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//	description : "THis is nothing included in the camgrprond, just emply campground"
//}, function(err, campground){
//	if(err){
//		console.log("we have error")
//	}else{
//		console.log("Newly created camp")
//		console.log(campground)	
//	}
//	
//})

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
			res.render("index", { campgrounds : campgrounds})
		}
	})
})

// NEW Route - show form to create new item
app.get("/campgrounds/new", function(req,res){
	res.render("new")	
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
			res.render("show",{campground: foundCampground})
		}
	})
})


app.listen(3000, function(){
	console.log("server is up")
})
