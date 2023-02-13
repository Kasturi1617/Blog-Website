//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const ejs = require("ejs");

const homeStartingContent = "Hey there! Life is weird. Sometimes its fun, sometimes its sad and sometimes its quite overwhelming. We know that there's a lot of things that are on your mind. So we have the perfect place for you. Pour out your heart here, write about your day, or write the story you have been thinking to write. It's your area. Enjoy :)";

const aboutContent = "Hey :)" + "\n" + "I am Kasturi , a MCA 3rd Year student. Often in life I have wondered about a platform where I can pour my heart out. So I decided a blog website would be the best idea for a project ^-^"

const contactContent = "Loved my work ? Please do contact me!";

const app = express();
mongoose.connect("mongodb+srv://admin-kasturi:Test123@cluster0.huo28.mongodb.net/BlogDB", {useNewUrlParser: true});
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: String
});

const Blog = mongoose.model("Blog", blogSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

  Blog.find({}, function(err, foundItems){
    res.render("home", {
      homeStartingContent: homeStartingContent,
      allPosts: foundItems
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
})

app.get("/posts/:blogName", function(req, res){
  //const requestedTitle = req.params.blogName;
  Blog.find({}, function(err, foundItems){
      for(let i = 0; i < foundItems.length; i++)
      {
        if(_.lowerCase(foundItems[i].title) == _.lowerCase(req.params.blogName))
          res.render("post", {Post: foundItems[i]});
      }
  });
});

app.post("/compose", function(req, res){

    const content = new Blog({
      title: req.body.postTitle,
      body: req.body.postBody
    });
    content.save();
    res.redirect("/");
});

let port = process.env.PORT;
if(port == null || port == "") port = 3000;

app.listen(port, function() {
  console.log("Server started on port 3000");
});
