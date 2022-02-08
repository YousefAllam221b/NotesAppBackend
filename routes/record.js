const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Check if Username exists before Registering Route
recordRoutes.route("/register/:name").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { name: (req.params.name)};

  db_connect
  .findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);   
  });
});

// Register Route
recordRoutes.route("/register/:name/:password").post(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { name: (req.params.name), password: (req.params.password), Notes: []};

  db_connect
  .insertOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);   
  });
});

// Login route
recordRoutes.route("/login/:name/:password").get(async function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = {name: (req.params.name), password: (req.params.password)};
  db_connect
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);   
      });
});

// Add Note Route
recordRoutes.route("/addNote/:userID/:title").post(async(req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.userID)};
  let oid = new ObjectId();
  await db_connect
      .updateOne(myquery, {$push:{'Notes': {_id: oid, title : req.params.title, value: ''}}}, function (err, res) {
        if (err) throw err;
        response.json(oid);
  });
});

// Add Notes before Login Route
recordRoutes.route("/addNote/:userID/:title/:value").post(async (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.userID)};
  let oid = new ObjectId();
  db_connect
    .updateOne(myquery, {$push:{Notes: {_id: oid, title: req.params.title, value: req.params.value}}}, function (err, res) {
      if (err) throw err;
      response.json(oid);
  });
});

// Update Note Title Route
recordRoutes.route(["/updateTitle/:userID/:noteID/:updatedTitle","/updateTitle/:userID/:noteID/"]).post(async(req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.userID), "Notes._id": new ObjectId(req.params.noteID)};
  db_connect
    .updateOne(myquery, {$set:{"Notes.$.title":  req.params.updatedTitle}}, function (err, res) {
      if (err) throw err;
      response.json(res);
  });
});

// Update Note Text Route
recordRoutes.route(["/update/:userID/:noteID/:updatedText","/update/:userID/:noteID/"]).post(async(req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.userID), "Notes._id": new ObjectId(req.params.noteID)};
  db_connect
    .updateOne(myquery, {$set:{"Notes.$.value":  req.params.updatedText}}, function (err, res) {
      if (err) throw err;
      response.json(res);
  });
});

// Delete Note Route
recordRoutes.route("/deleteNote/:userID/:noteID").post(async (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.userID)};
  await db_connect
  .updateOne(myquery, {$pull: {Notes : {_id: new ObjectId(req.params.noteID)}} }, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

module.exports = recordRoutes;