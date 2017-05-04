var mongoose = require('mongoose');

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

// as == another system
System.methods.distance = function (as) {
  var dx = (this.x - as.x);
  var dy = (this.y - as.y);
  var dz = (this.z - as.z);

  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

var SystemModel = mongoose.model('System', System);

module.exports.SystemModel = SystemModel;
module.exports.url = "https://eddb.io/archive/v5/systems_populated.json";
