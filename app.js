var express = require("express");
var bodyParser=require("body-parser");
var app = express();
//var http = require('http');
app.set("view engine", "ejs");
//app.use(express.static("public"));
app.use(express.static("images"));
//app.listen(3000);
campgrounds=[
                {name: "Upper Big Bend", image: "Upper Big Bend.jpeg"},
                {name: "Oeschinen Lake", image: "Oeschinen Lake.jpeg"},
                {name: "Lac d'Amour", image: "Lac d'Amour.jpeg"},
		{name: "Upper Big Bend", image: "Upper Big Bend.jpeg"},
                {name: "Oeschinen Lake", image: "Oeschinen Lake.jpeg"},
                {name: "Lac d'Amour", image: "Lac d'Amour.jpeg"},
	 	{name: "Upper Big Bend", image: "Upper Big Bend.jpeg"},
                {name: "Oeschinen Lake", image: "Oeschinen Lake.jpeg"},
                {name: "Lac d'Amour", image: "Lac d'Amour.jpeg"}


]        


app.use(bodyParser.urlencoded({extended :true}))

app.get("/", function(req, res){
	//res.send("Landing Page");
	//res.end(); //end the response
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds : campgrounds});

});

app.post("/campgrounds", function(req, res){
	//res.send("you hit the post route");
	var name=req.body.name;
	var image=req.body.image;
	var newCampground={name:name, image:image}
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

//on ubuntu
app.listen(3000, function(){
        console.log("Server is up");
        //console.log(process.env);

});


