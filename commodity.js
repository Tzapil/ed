
var mongoose = require('mongoose');
var request = require('request');

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

function fetchJSON() {
  return new Promise(function (resolve, reject) {
    request({
      url: "https://eddb.io/archive/v5/commodities.json",
      json: true
    }, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        if (response.statusCode == 200) {
          resolve(body);
        } else {
          reject(new Error("Http error. Status code: " + response.statusCode));
        }
      }
    });
  });
}

function updateDB() {
  return new Promise(function (resolve, reject) {
    fetchJSON()
      .then(function (data) {
        var bulk = CommodityModel.collection.initializeUnorderedBulkOp();
        for (var i = 0; i < data.length; i++) {
          data[i].rare = !!data[i].is_rare;
          bulk.find({id: data[i].id}).upsert().update({$set: data[i]}, {strict: true});
        }
        bulk.execute(function (err, result) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }, function (err) {
        reject(err);
      });
  });
}

var CommodityModel = mongoose.model('Commodity', Commodity);

module.exports.CommodityModel = CommodityModel;
module.exports.fetchJSON = fetchJSON;
module.exports.updateDB = updateDB;
