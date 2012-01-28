var dao = require('../models/databaseObject'),
    keys = require('../models/keys'),
    errors = require('../errors'),
    validation = require('../lib/validation');
    
exports.headers = function(req, res, next) {
  res.setHeader("x-vegastech-api-version", "0.0.1");
  next();
}

exports.index = function(req, res){
  res.json({ msg: 'Welcome to Vegas Tech API' });
};

exports.getByKey = function(req, res, next) {
  var key = parseKeyFromString(req.params[0]);
  console.log(key);
  dao.getByKey(key, function(err, object) {
    if (err) { return next(err);}
    if (typeof object === 'array') {
      expandCollection(object, function(err, collection) {
        if (err) { return next(err);}
        return res.json(collection, 200);
      });
    }
    else {
      res.json(object, 200); 
    }
  });
}

function parseKeyFromString(string) {
  return keys.prefix + string.replace(/\//g,':');
}
