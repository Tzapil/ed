var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Station = new Schema({
  id: {
    type: Number,
    unique: true
  },
  name: String,
  system_id: Number,
  updated_at: Date,
  max_landing_pad_size: String,
  distance_to_star: Number,
  government_id: Number,
  government: String,
  allegiance_id: Number,
  allegiance: String,
  state_id: Number,
  state: String,
  type_id: Number,
  type: String,
  has_blackmarket: Boolean,
  has_refuel: Boolean,
  has_repair: Boolean,
  has_rearm: Boolean,
  has_outfitting: Boolean,
  has_shipyard: Boolean,
  has_docking: Boolean,
  has_commodities: Boolean,
  import_commodities: [String],
  export_commodities: [String],
  prohibited_commodities: [String],
  economies: [String],
  shipyard_updated_at: Date,
  outfitting_updated_at: Date,
  market_updated_at: Date,
  is_planetary: Boolean,
  selling_ships: [String],
  selling_modules: [Number],
  settlement_size_id: Number,
  settlement_size: String,
  settlement_security_id: Number,
  settlement_security: String,
  body_id: Number,
  controlling_minor_faction_id: Number
});

var StationModel = mongoose.model('Station', Station);

module.exports.StationModel = StationModel;
module.exports.url = "https://eddb.io/archive/v5/stations.json";
