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
recordRoutes.route("/login/:name/:password").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { name: (req.params.name.substring(1)), password: (req.params.password.substring(1))};

  db_connect
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);   
      });
});

// Add Note Route
recordRoutes.route("/addNote/:title").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { name : "yousef"};
  db_connect
    .updateOne(myquery, {$push:{'Notes': {"title" : req.params.title.substring(1), "value": ''}}}, function (err, res) {
      if (err) throw err;
      response.json(res);
  });
});

// Update Note Text Route
recordRoutes.route("/update/:index/:updatedText").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { name : "yousef"};

  let newvalues = {}
  newvalues["Notes." + parseInt(req.params.index.substring(1)) + ".value"] = req.params.updatedText.substring(1)
  console.log(newvalues);
  db_connect
    .updateOne(myquery, {$set:newvalues}, function (err, res) {
      if (err) throw err;
      response.json(res);
  });
});

//Delete Note Route
recordRoutes.route("/deleteNote/:index").post(function (req, response) {
  deletingNote(req.params.index);
});

//async function to delete notes. Async to wait for setting the value with null then remove any null value.
async function deletingNote(noteIndex)
{
  let db_connect = dbo.getDb();
  let myquery = { name : "yousef"};
  let newvalues = {}
  newvalues["Notes." + noteIndex] = 1
  console.log(newvalues);
  await db_connect
    .updateOne(myquery, {$unset: newvalues }, function (err, res) {
  });
  db_connect
  .updateOne(myquery, {$pull: {"Notes" : null} }, function (err, res) {
    if (err) throw err;
  });
 }

{
// This section will help you update a record by id.
// recordRoutes.route("/record/add").post(function (req, response) {
//   let db_connect = dbo.getDb();
//   let myobj = {
//     person_name: "nada",
//     person_position: "designer",
//     person_level: "level 2",
//   };
//   db_connect.collection("Users").insertOne(myobj, function (err, res) {
//     if (err) throw err;
//     response.json(res);
//   });
// });


  //    db_connect
  //   .collection("Users")
  //   .updateOne(myquery, newvalues, function (err, res) {
  //     if (err) throw err;
  //     console.log("1 document updated");
  //     response.json(res);
  //   });
  // console.log("HEREREERE");
// });

// // This section will help you delete a record
// recordRoutes.route("/:id").delete((req, response) => {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId( req.params.id )};
//   db_connect.collection("records").deleteOne(myquery, function (err, obj) {
//     if (err) throw err;
//     console.log("1 document deleted");
//     response.status(obj);
//   });
// });
}
module.exports = recordRoutes;