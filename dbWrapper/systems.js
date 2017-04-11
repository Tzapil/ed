var mongoose = require('mongoose');

// id,edsm_id,name,x,y,z,population,is_populated,government_id,government,allegiance_id,allegiance,state_id,state,security_id,security,primary_economy_id,primary_economy,power,power_state,power_state_id,needs_permit,updated_at,simbad_ref,controlling_minor_faction_id,controlling_minor_faction,reserve_type_id,reserve_type

var Schema = mongoose.Schema;
var System = new Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    unique: true
  },
  updated_at: Number,
  government_id: Number,
  government: String,
  allegiance_id: Number,
  allegiance: String,
  state_id: Number,
  state: String,
  home_system_id: Number,
  is_player_faction: Boolean
});

var SystemModel = mongoose.model('System', System);

module.exports.SystemModel = SystemModel;
