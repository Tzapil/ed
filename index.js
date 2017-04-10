
var mongoose = require('mongoose');
var request = require('request');
var config = require('./config');
var commodity = require('./commodity');
var factions = require('./factions');
var systems_recently = require('./systems_recently');

mongoose.connect(config.mongo);
var db = mongoose.connection;

db.on("open", function () {
  console.log("db connected");
  // commodity.updateDB();
  // factions.updateDB();
  systems_recently.updateDB();
});

db.on("error", function () {
  console.log("db error");
})
