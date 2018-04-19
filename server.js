// required npm
import express from "express";
import bodyParser from "body-parser";
import cheerio from "cheerio";
import expressH from "express-handlebars";
import mongoose from "mongoose";
import request from "request";

// additional npm
import logger from "morgan";
import axios from "axios";

// import db
import db from "./config/connection.js";
//import models
import Note from "./models/note.js";
import User from "./models/user.js";
import Article from "./models/article.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongod://localhost/mongodHw");

//home page will show blank fields


// gets called when scraping for articles
app.get("/scrape", function (req, res) {
    axios.get("http://www.echojs.com/").then(function (response) {
        const $ = cheerio.load(response.data);

        $("article h2").each(function (i, element) {
            let result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    consol.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
        res.send("Scrape Complete");
    });
});

// will get scraped articles from db
app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

// get call for specific article by id, populate it with its note
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  
// post route for saving/updating an articles note
app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new:true});
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});



app.listen(port, function () {
    console.log('App running on port ' + port);
});