var dao = require('../models/databaseObject'),
    keys = require('../models/keys'),
    errors = require('../errors'),
    validation = require('../lib/validation');

exports.create = function(req, res, next) {

  var person = {
    name: req.body.name,
    twitter: req.body.twitter
  };
  
  personValidation(person, function(err) {
    if (err) {
      var error = new errors.ValidationError('Person creation failed', err);
      return next(error);
    }
    dao.setByAndIncrementKey(keys.peopleId, keys.personKey, person, function(err, key) {
      if (err) {
        return next(err);
      }
      else {
        dao.setByKey(keys.peopleKey, key, 'set', function(err) {
          res.json(key, 201);
        });
      }
    });
  });
}

function personValidation(object, callback) {
  var err = [];
  if (!object) { err.unshift({msg: 'No person to validate'});}
  if (!object.name) { err.unshift({msg: 'missing parameter', parameter: 'name'});}
  if (!object.twitter) { err.unshift({msg: 'missing parameter', parameter: 'twitter'});}
  if (err.length == 0) { err = null;}
  return callback(err);
}
