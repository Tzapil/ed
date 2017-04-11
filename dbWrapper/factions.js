var https = require("https");
var helpers = require('../helpers.js');
var mongoose = require('mongoose');

// id,name,updated_at,government_id,government,allegiance_id,allegiance,state_id,state,home_system_id,is_player_faction

var Schema = mongoose.Schema;
var Faction = new Schema({
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

var FactionModel = mongoose.model('Faction', Faction);

module.exports.FactionModel = FactionModel;
module.exports.url = "https://eddb.io/archive/v5/factions.csv";
