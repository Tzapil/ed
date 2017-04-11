var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Commodity = new Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    unique: true
  },
  category_id: Number,
  average_price: Number,
  rare: Boolean,
  category: {
    id: Number,
    name: String
  }
});

var CommodityModel = mongoose.model('Commodity', Commodity);

module.exports.CommodityModel = CommodityModel;
module.exports.url = "https://eddb.io/archive/v5/commodities.json";
