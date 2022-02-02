const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a single record by id
recordRoutes.route("/login/:name/:password").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { name: (req.params.name.substring(1)), password: (req.params.password.substring(1))};

  db_connect
      .collection("Users")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);   
      });
});

// This section will help you create a new record.
recordRoutes.route("/update/:index/:updatedText").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { name : "yousef"};

  let newvalues = {}
  newvalues["Notes." + parseInt(req.params.index.substring(1))] = {"value": req.params.updatedText.substring(1)}
  console.log(newvalues);
  // db_connect
  //   .collection("Users")
  //   .updateOne(myquery, {$set:{newvalues}}, function (err, res) {
  //     if (err) throw err;
  //     console.log("1 document updated");
  //     console.log(res);
  //     response.json(res);
    
  // });
});


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

module.exports = recordRoutes;