const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This saves a Document
recordRoutes.route("/saveDoc").post(function (req, res) {
  console.log(req);
  const dbConnect = dbo.getDb();
  const newDoc = {
    title: req.body.title,
    content_stemmed: req.body.content_stemmed,
    uri: req.body.uri,
  };

  dbConnect.collection("web-crawler3").insertOne(newDoc, function (err, result) {
    if (err) {
      res.status(400).send("Error saving Doc!");
    } else {
      console.log(`Added New Doc!`);
      res.status(204).send();
    }
  });
});

module.exports = recordRoutes;
