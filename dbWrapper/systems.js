var mongoose = require('mongoose');
var helpers = require('../helpers');

// id,edsm_id,name,x,y,z,population,is_populated,government_id,government,allegiance_id,allegiance,state_id,state,security_id,security,primary_economy_id,primary_economy
// power,power_state,power_state_id,needs_permit,updated_at,simbad_ref,controlling_minor_faction_id,controlling_minor_faction,reserve_type_id,reserve_type

var Schema = mongoose.Schema;
var System = new Schema({
  id: {
    type: Number,
    unique: true
  },
  edsm_id: Number,
  name: {
    type: String
  },
  x: Number,
  y: Number,
  z: Number,
  population: String,
  is_populated: Boolean,
  updated_at: Number,
  government_id: Number,
  government: String,
  allegiance_id: Number,
  allegiance: String,
  state_id: Number,
  state: String,
  security_id: Number,
  security: String,
  primary_economy_id: Number,
  primary_economy: Number,
  needs_permit: Boolean,
  home_system_id: Number,
  is_player_faction: Boolean
});

// ================ PRIVATE ==================

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

// ================ PUBLIC ==================

// as == another system
System.methods.distance = function distance(as) {
  const dx = (this.x - as.x);
  const dy = (this.y - as.y);
  const dz = (this.z - as.z);

  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

System.methods.findSystemsInRange = function findSystemsInRange(range, exclude) {
  exclude = exclude || [];

  var self = this;

  return new Promise(function (resolve, reject) {
    self.model('System').find({id: {$ne: self.id},
                x: {$gte: self.x - range, $lte: self.x + range},
                y: {$gte: self.y - range, $lte: self.y + range},
                z: {$gte: self.z - range, $lte: self.z + range}}, function (err, systems) {
      if (err) throw err;

      resolve(systems.filter(item => self.distance(item) <= range && !helpers.any(exclude, (e_item) => e_item == item.id)));
    });
  });
}

System.methods.pathTo = function pathTo(target, fsd_power) {
  var self = this;
  return new Promise(function (resolve, reject) {
    function recursion(current, target, fsd, path) {
      current.findSystemsInRange(fsd, path)
        .then(helpers.decorator(sortSystemsThoughDistance, target))
        .then(function (systems) {
          if (systems.length == 0) {
            resolve([]);
            return;
          }

          if (systems[0].id == target.id) {
            resolve([...path, target]);
            return;
          }

          recursion(systems[0], target, fsd, [...path, systems[0]]);
        });
    }

    recursion(self, target, fsd_power, [self]);
  });
}

System.statics.findByName = function findByName(name) {
  var self = this;

  return new Promise(function (resolve, reject) {
    self.findOne({name: name}, function (err, system) {
      if (err) throw err;

      resolve(system);
    });
  });
}

var SystemModel = mongoose.model('System', System);

module.exports.SystemModel = SystemModel;
module.exports.url = "https://eddb.io/archive/v5/systems_populated.json";
