
var mongoose = require('mongoose');
var request = require('request');
var config = require('./config');
var helpers = require('./helpers');
var commodity = require('./dbWrapper/commodity');
var factions = require('./dbWrapper/factions');
var systems = require('./dbWrapper/systems');
var prices = require('./dbWrapper/prices');
var stations = require('./dbWrapper/stations');

mongoose.connect(config.mongo, config.options);
var db = mongoose.connection;

db.on("open", function () {
  console.log("db connected");

  let start = new Date();
  let fsd_power = 20;

  helpers.updateDB(stations.StationModel, stations.url).then(function () {
    console.log("done", (new Date()).getTime() - start.getTime(), "ms");
    process.exit(1);
  }, function () {
    console.log("error");
    console.log(arguments);
    process.exit(1);
  });

  // console.log("Start to search");
  // let promises = [systems.SystemModel.findByName("Sol"), systems.SystemModel.findByName("V711 Tauri")];
  //
  // Promise.all(promises).then(function ([sol, v711]) {
  //   console.log("Systems found", (new Date()).getTime() - start.getTime(), "ms");
  //   console.log(sol.distance(v711));
  //   sol.pathTo(v711, fsd_power).then(function (path) {
  //     console.log("Path found", (new Date()).getTime() - start.getTime(), "ms");
  //     console.log(path.length);
  //     console.log(path.map(item => item.name));
  //     process.exit(1);
  //   }).catch(function () {
  //     console.log("ERROR", (new Date()).getTime() - start.getTime(), "ms");
  //     console.log(arguments);
  //     process.exit(1);
  //   });
  // }).catch(function () {
  //   console.log("Error. Cant find systems", (new Date()).getTime() - start.getTime(), "ms");
  //   process.exit(1);
  // });
});

db.on("error", function () {
  console.log("db error");
})
