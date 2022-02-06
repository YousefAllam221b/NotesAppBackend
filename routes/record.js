const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Login route
recordRoutes.route("/login/:name/:password").get(async function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { name: (req.params.name), password: (req.params.password)};

  await db_connect
  .updateMany(myquery, {$pull: {"Notes" : null} }, function (err, res) {
    if (err) throw err;
  });

  db_connect
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);   
      });
});

// Add Note Route
recordRoutes.route("/addNote/:userID/:title").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.userID)};
  db_connect
    .updateOne(myquery, {$push:{'Notes': {"title" : req.params.title, "value": ''}}}, function (err, res) {
      if (err) throw err;
      response.json(res);
  });
});

recordRoutes.route("/addNote/:userID/:title/:value").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.userID)};
  db_connect
    .updateOne(myquery, {$push:{'Notes': {"title" : req.params.title, "value": req.params.value}}}, function (err, res) {
      if (err) throw err;
      response.json(res);
  });
});

// Update Note title Route
recordRoutes.route(["/updateTitle/:userID/:index/:updatedTitle","/updateTitle/:userID/:index/"]).post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.userID)};

  let newvalues = {}
  newvalues["Notes." + parseInt(req.params.index) + ".title"] = req.params.updatedTitle
  db_connect
    .updateOne(myquery, {$set:newvalues}, function (err, res) {
      if (err) throw err;
      response.json(res);
  });
});

// Update Note Text Route
recordRoutes.route(["/update/:userID/:index/:updatedText","/update/:userID/:index/"]).post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.userID)};

  let newvalues = {}
  newvalues["Notes." + parseInt(req.params.index) + ".value"] = req.params.updatedText
  db_connect
    .updateOne(myquery, {$set:newvalues}, function (err, res) {
      if (err) throw err;
      response.json(res);
  });
});

//Delete Note Route
recordRoutes.route("/deleteNote/:userID/:index").post(async function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.userID)};
  let newvalues = {}
  newvalues["Notes." + req.params.index] = 1
  await db_connect
    .updateOne(myquery, {$unset: newvalues }, function (err, res) {
  });
  await db_connect
  .updateMany(myquery, {$pull: {Notes : null} }, function (err, res) {
    if (err) throw err;
  });
  await db_connect
  .updateMany(myquery, {$pull: {Notes : null} }, function (err, res) {
    if (err) throw err;
  });
});

recordRoutes.route("/register/:name").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { name: (req.params.name)};

  db_connect
  .findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);   
  });
});

recordRoutes.route("/register/:name/:password").post(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { name: (req.params.name), password: (req.params.password), Notes: []};

  db_connect
  .insertOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);   
  });
});

module.exports = recordRoutes;