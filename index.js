
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
      if (err) throw err;

      resolve(systems.filter(item => item.distance(system) <= range && !any(exclude, (e_item) => e_item == item.id)));
    });
  });
}

function sortSystemsThoughDistance(systems, system) {
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

  return systems;
}

function decorator(f, ...args1) {
  return function (...args2) {
    return new Promise(function (resolve, reject) {
      resolve(f(...args2, ...args1));
    });
  }
}

function path (s1, s2, fsd) {
  return new Promise(function (resolve, reject) {
    function recursion (s1, s2, fsd, path) {
      findSystemsInRange(s1, fsd, path)
        .then(decorator(sortSystemsThoughDistance, s2))
        .then(function (systems) {
          if (systems.length == 0) {
            resolve([]);
            return;
          }

          if (systems[0].id == s2.id) {
            resolve([...path, s2]);
            return;
          }

          recursion(systems[0], s2, fsd, [...path, systems[0]]);
        });
    }

    recursion(s1, s2, fsd, [s1]);
  });
}

function findSystem (name) {
  return new Promise(function (resolve, reject) {
    systems.SystemModel.findOne({name: name}, function (err, system) {
      if (err) throw err;

      resolve(system);
    });
  });
}

db.on("open", function () {
  console.log("db connected");

  let start = new Date();
  let fsd_power = 20;
  //helpers.updateDB(commodity.CommodityModel, commodity.url);
  // helpers.updateDB(systems.SystemModel, systems.url).then(function () {
  //   console.log("done", (new Date()).getTime() - start.getTime(), "ms");
  //   process.exit(1);
  // }, function () {
  //   console.log("error");
  //   process.exit(1);
  // });

  console.log("Start to search");
  let promises = [findSystem("Sol"), findSystem("V711 Tauri")];

  Promise.all(promises).then(function ([sol, v711]) {
    console.log("Systems found", (new Date()).getTime() - start.getTime(), "ms");
    console.log(sol.distance(v711));
    path(sol, v711, fsd_power).then(function (path) {
      console.log("Path found", (new Date()).getTime() - start.getTime(), "ms");
      console.log(path.length);
      console.log(path.map(item => item.name));
      process.exit(1);
    });

    // findSystemsInRange(sol, fsd_power).then(decorator(sortSystemsThoughDistance, v711)).then(function (systems) {
    //   console.log(systems.length);
    //   console.log(systems.map((item) => {
    //     return {
    //       name: item.name,
    //       r: item.distance(v711)
    //     }
    //   }));
    //   console.log("done", (new Date()).getTime() - start.getTime(), "ms");
    //   process.exit(1);
    // })
    // .catch(function () {
    //   console.log("error", (new Date()).getTime() - start.getTime(), "ms");
    //   process.exit(1);
    // });
  }).catch(function () {
    console.log("Error. Cant find systems", (new Date()).getTime() - start.getTime(), "ms");
    process.exit(1);
  });
});

db.on("error", function () {
  console.log("db error");
})
