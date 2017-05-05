var mongoose = require('mongoose');

//id,station_id,commodity_id,supply,buy_price,sell_price,demand,collected_at

var Schema = mongoose.Schema;
var Price = new Schema({
  id: {
    type: Number,
    unique: true
  },
  station_id: Number,
  commodity_id: Number,
  supply: Number,
  buy_price: Number,
  sell_price: Number,
  demand: Number,
  collected_at: Date
});

var PriceModel = mongoose.model('Price', Price);

module.exports.PriceModel = PriceModel;
module.exports.url = "https://eddb.io/archive/v5/listings.csv";
