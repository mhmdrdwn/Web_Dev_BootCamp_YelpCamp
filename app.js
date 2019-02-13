var express = require("express");
var bodyParser=require("body-parser");
var app = express();
var mongoose = require('mongoose');

app.set("view engine", "ejs");
//app.use(express.static("public"));
app.use(express.static("images"));
//app.listen(3000);


//DB schema
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
var campgroundSchema= new mongoose.Schema({
	name:String,
	image:String,
	description:String
});

var Campground=mongoose.model("Campground", campgroundSchema);

//Campground.create(
//	{
//		name:"Oeschinen Lake", 
//		image: "Oeschinen Lake.jpeg",
//		description:"New Campground to test"
//
//	}, function(err, newCampground){
//		if(err){
//			console.log("error");
//			console.log(err);
//		}else{
//			console.log("added to DB");
//			console.log(newCampground);
//		}
//	});


//campgrounds=[
//                {name: "Upper Big Bend", image: "Upper Big Bend.jpeg"},
//                {name: "Oeschinen Lake", image: "Oeschinen Lake.jpeg"},
//                {name: "Lac d'Amour", image: "Lac d'Amour.jpeg"},
//		{name: "Upper Big Bend", image: "Upper Big Bend.jpeg"},
//                {name: "Oeschinen Lake", image: "Oeschinen Lake.jpeg"},
//                {name: "Lac d'Amour", image: "Lac d'Amour.jpeg"},
//	 	{name: "Upper Big Bend", image: "Upper Big Bend.jpeg"},
//                {name: "Oeschinen Lake", image: "Oeschinen Lake.jpeg"},
//                {name: "Lac d'Amour", image: "Lac d'Amour.jpeg"}
//
//
//]        


app.use(bodyParser.urlencoded({extended :true}));

app.get("/", function(req, res){
	//res.send("Landing Page");
	//res.end(); //end the response
	res.render("landing");
});

// INDEX Route, show all campogrounds
app.get("/campgrounds", function(req, res){
	//res.render("campgrounds", {campgrounds : campgrounds});
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("index",{campgrounds:allCampgrounds});
		}
	});

});

// CREATE Route, Add new Campground
app.post("/campgrounds", function(req, res){
	//res.send("you hit the post route");
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var newCampground={name:name, image:image, description: desc}
	//the next line to the array
	//campgrounds.push(newCampground);
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	//res.redirect("/campgrounds");
});

// NEW Route, show new form to add new entry
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

// SHOW Route, show more info about campground with ID
app.get("/campgrounds/:id", function(req, res){
	//res.send("this will be the show page");
	// capturing the id from the more info button and show it
	Campground.findById(req.params.id, function(err, foundCampground){
	if(err){
		console.log(err);
	}else{
		res.render("show", {campground:foundCampground});
	}
	});
	
});

//on ubuntu
app.listen(3000, function(){
        console.log("Server is up");
        //console.log(process.env);

});


