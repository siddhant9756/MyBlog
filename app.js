var express = require("express");
var app = express();
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride=require("method-override");

mongoose.connect("mongodb://localhost/blog_app");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname , "/public")));
var blogSchema = new mongoose.Schema({
    title: String,
    image:String,
    body:String,
    created:{type:Date , default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);



app.get("/",function(req,res){
	res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if (err) {console.log(err);}
		else{res.render("index",{blog:blogs})};
	});
});
//create route
app.post("/blogs",function(req,res){
	var title = req.body.title;
	var image = req.body.image;
	var body = req.body.body;
	var newblog = {title: title,image: image,body:body};
	Blog.create(newblog,function(err,newblog){
		if (err) {res.render("new");}
		else{res.redirect("/blogs");}
	});
});
app.get("/blogs/new",function(req,res){
	res.render("new");
});
//show route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if (err) {res.redirect("/blogs");}
		else{res.render("show",{blog:foundBlog});}
	});

	
});
//edit route
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if (err) {res.redirect("/blogs");}
		else{res.render("edit",{blog:foundBlog});}
	});
});
//update route
app.put("/blogs/:id",function(req,res){
	var title = req.body.title;
	var image = req.body.image;
	var body = req.body.body;
	var newblog = {title: title,image: image,body: body};
	/*req.body.blog.body = req.sanitize(req.body.blog.body);*/
	Blog.findByIdAndUpdate(req.params.id,newblog,function(err,updatedBlog){
		if (err) {res.redirect("/blogs");}
		else{res.redirect("/blogs/" + req.params.id);}
	});
});
//delete route
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,foundBlog){
		if (err) {res.redirect("/blogs");}
		else{res.redirect("/blogs");}
	});
});
app.listen(3333,function(){
	console.log("ur server started on port 3333");
})