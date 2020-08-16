const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

mongoose.connect("mongodb://localhost:27017/blogDB3", {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;
const blogSchema = new Schema({
  title: String,
  content: String
});

const Post = mongoose.model("post", blogSchema);

///////////////////// Home page /////////////////////
app.get("/", (req, res) => {

  Post.find({}, (err, posts) => {
    res.render("home", {
      posts: posts
    })
  });

});

///////////////////// Post page /////////////////////
app.get("/posts/:postId", (req, res) => {

  Post.findOne({_id: req.params.postId}, function(err, post){
    res.render("post", {
      id: post._id,
      title: post.title,
      content: post.content
    });
  });

});

///////////////////// Edit page /////////////////////
app.get("/posts/:postId/edit", (req, res) => {

  Post.findById({_id: req.params.postId}, (err, post) => {
    res.render("edit", {
      id: post._id,
      title: post.title,
      content: post.content
    });
  });

});

app.post("/posts/:postId/edit", (req, res) => {

  Post.findByIdAndUpdate({_id: req.params.postId},
    {
      title: req.body.postTitle,
      content: req.body.postBody
    },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
      else {
        res.redirect("/")
      }
    });
});

///////////////////// Compose page /////////////////////
app.get("/compose", (req, res) => {
  res.render("compose", {title: "", content: ""})
})

app.post("/compose", function(req, res){

  Post.create(
    {
      title: req.body.postTitle,
      content: req.body.postBody
    }, (err) => {
      if (!err) {
        res.redirect("/");
      } else {
        console.log(err);
      }
    }
  );
});

///////////////////// Deelete page /////////////////////
app.post("/posts/:postId/delete", (req, res) => {

  Post.findByIdAndDelete({_id: req.params.postId}, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/")
    }
  });
});








app.listen(3000, ()=> {
  console.log("Server is up on port 3000");
});
