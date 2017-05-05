var https = require('https');
var request = require('request');

function fetchJSON(url, callback) {
  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (error) {
      callback(error);
    } else {
      if (response.statusCode == 200) {
        callback(null, body, true);
      } else {
        callback(new Error("Http error. Status code: " + response.statusCode));
      }
    }
  });
}

function pack(names, arr) {
  var result = {};

  for (var i = 0; i < names.length; i++) {
    result[names[i]] = arr[i];
  }

  return result;
}

//"https://eddb.io/archive/v5/factions.csv"
function fetchCSV(url, callback) {
  var data = "";
  var headers = null;
  var counter = 0;
  https.get(url, function (res) {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      data = data + chunk;
      var splited = data.split('\n');

      // skip for small data
      if (splited.length == 1) return;

      // shift headers
      if (!headers) {
        headers = splited.shift().split(',');
      }

      data = splited.pop();
      counter += splited.length;
      callback(null, splited.map((item) => pack(headers, item.split(','))));
    });

    res.on('end', () => {
      var splited = data.split('\n');
      counter += splited.length;
      callback(null, splited.map((item) => pack(headers, item.split(','))), true);

      console.log('No more data in response.');
      console.log(counter, 'rows in total');
    });

    res.on('error', (err) => {
      callback(err);
    })
  })
}

function updateDB(Scheme, url) {
  var fetcher = fetchJSON;

  if ((/\.csv$/gi).test(url)) {
    fetcher = fetchCSV;
  }

  return new Promise(function (resolve, reject) {
    var bulk = Scheme.collection.initializeUnorderedBulkOp();
    var operations = [];
    var counter = 0;

    fetcher(url, function (err, data, done) {
      if (err) throw err;

      for (var i = 0; i < data.length; i++) {
        bulk.find({id: data[i].id}).upsert().updateOne(data[i], {strict: true});
      }

      counter += data.length;

      if (done || counter > 1000) {
        counter = 0;
        operations.push(new Promise(function (res, rej) {
          bulk.execute(function (err, result) {
            if (err) throw err;
            res();
          });
        }));

        if (done) {
          Promise.all(operations).then(() => resolve());
        }

        bulk = Scheme.collection.initializeOrderedBulkOp();
      }
    });
  });
}

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

function decorator(f, ...args1) {
  return function (...args2) {
    return new Promise(function (resolve, reject) {
      resolve(f(...args2, ...args1));
    });
  }
}

module.exports.fetchJSON = fetchJSON;
module.exports.fetchCSV = fetchCSV;
module.exports.updateDB = updateDB;
module.exports.any = any;
module.exports.decorator = decorator;
