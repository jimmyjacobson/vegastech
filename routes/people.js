var dao = require('../models/databaseObject');
var keys = require('../models/keys');
var errors = require('../errors');

exports.index = function(req, res){
  dao.getAndExpandCollection(keys.peopleKey, 'set', function(err, collection) {
    res.json(collection, 200);
  })
};

exports.create = function(req, res, next) {

  var person = {
    name: req.body.name,
    twitter: req.body.twitter
  };
  
  personValidation(event, function(err) {
    if (err) {
      return next(new errors.ValidationError(err));
    }
    dao.setByAndIncrementKey(keys.peopleId, keys.personKey, event, function(err, key) {
      if (err) {
        return next(err);
      }
      else {
        dao.setByKey(keys.peopleKey, key, 'set', function(err) {
          console.log(err);
          res.json(key);
        });
      }
    });
  });
}

exports.getByKey = function(req, res, next) {
  console.log('here');
  var key = req.params.eventKey;
  dao.getByKey(key, 'hash', function(err, event) {
    if (err) { return next(err);}
    res.json(event, 200);
  });

}

exports.notFound = function(req, res) {
  res.json ('Event not found', 404);
}

function personValidation(event, callback) {
  var err = [];
  if (!event.name) { err.unshift('missing field: name');}
  if (!event.twitter) { err.unshift('missing field: twitter')}
  
  if (err.length == 0) { err = null;}
  return callback(err);
}
