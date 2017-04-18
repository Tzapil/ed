
var mongoose = require('mongoose');
var request = require('request');
var config = require('./config');
var helpers = require('./helpers');
var commodity = require('./dbWrapper/commodity');
var factions = require('./dbWrapper/factions');
var systems = require('./dbWrapper/systems');

mongoose.connect(config.mongo, config.options);
var db = mongoose.connection;

function any(arr, predicate) {
  var result = false;

  for (var i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      result = true;
      break;
    }
  }

  return result;
}

function findSystemsInRange(system, range, exclude) {
  exclude = exclude || [];

  return new Promise(function (resolve, reject) {
    systems.SystemModel.find({id: {$ne: system.id},
                              x: {$gte: system.x - range, $lte: system.x + range},
                              y: {$gte: system.y - range, $lte: system.y + range},
                              z: {$gte: system.z - range, $lte: system.z + range}}, function (err, systems) {
      if (err) reject(err);

      resolve(systems.filter((item) => item.distance(system) <= range && !any(exclude, (e_item) => e_item == item.id)));
    });
  });
}

function sortSystemsThoughRange(system) {
  return function (systems) {
    systems = systems || [];

    return new Promise(function (resolve, reject) {
      systems.sort(function (a, b) {
        var as = a.distance(system);
        var bs = b.distance(system);
        if (as < bs) {
          return -1;
        }

        if (as > bs) {
          return 1;
        }

        return 0
      });

      resolve(systems);
    });
  }
}

function findPath (s1, s2, fsd, path) {
  path = path || [];

  return new Promise(function (resolve, reject) {
    findSystemsInRange(s1, fsd, path)
      .then(sortSystemsThoughRange(s2))
      .then(function (systems) {
        if (systems.length == 0) {
          resolve([]);
          return;
        }

        if (systems[0].id == s2.id) {
          resolve([s1, s2]);
        }

        return findPath(systems[0], s2, [s1]);
      });
  });
}


db.on("open", function () {
  console.log("db connected");

  var start = new Date();
  //helpers.updateDB(commodity.CommodityModel, commodity.url);
  // helpers.updateDB(systems.SystemModel, systems.url).then(function () {
  //   console.log("done", (new Date()).getTime() - start.getTime(), "ms");
  //   process.exit(1);
  // }, function () {
  //   console.log("error");
  //   process.exit(1);
  // });

  console.log("Start to search");
  systems.SystemModel.findOne({name: "Sol"}, function (err, system) {
    if (err) throw err;

    var fsd_power = 18;

    findSystemsInRange(system, fsd_power).then(sortSystemsThoughRange(system)).then(function (systems) {
      console.log(systems.length);
      console.log(systems.map((item) => {
        return {
          name: item.name,
          r: item.distance(system)
        }
      }));
      console.log("done", (new Date()).getTime() - start.getTime(), "ms");
      process.exit(1);
    })
    .catch(function () {
      console.log("error", (new Date()).getTime() - start.getTime(), "ms");
      process.exit(1);
    });
  })
  // factions.updateDB();
  //systems_recently.updateDB();
});

db.on("error", function () {
  console.log("db error");
})
