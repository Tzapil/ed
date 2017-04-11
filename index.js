
var mongoose = require('mongoose');
var request = require('request');
var config = require('./config');
var helpers = require('./helpers');
var commodity = require('./dbWrapper/commodity');
var factions = require('./dbWrapper/factions');
var systems_recently = require('./dbWrapper/systems_recently');

mongoose.connect(config.mongo);
var db = mongoose.connection;

db.on("open", function () {
  console.log("db connected");

  var start = new Date();
  //helpers.updateDB(commodity.CommodityModel, commodity.url);
  helpers.updateDB(factions.FactionModel, factions.url).then(function () {
    console.log("done", (new Date()).getTime() - start.getTime(), "ms");
    process.exit(1);
  }, function () {
    console.log("error");
    process.exit(1);
  });
  // factions.updateDB();
  //systems_recently.updateDB();
});

db.on("error", function () {
  console.log("db error");
})
