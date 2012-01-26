var dao = require('../models/databaseObject'),
    keys = require('../models/keys'),
    errors = require('../errors'),
    validation = require('../lib/validation');


exports.index = function(req, res){
  dao.getAndExpandCollection(keys.eventsKey, 'set', function(err, collection) {
    res.json(collection, 200);
  })
};

exports.create = function(req, res, next) {

  var event = {
    name: req.body.name,
    description: req.body.description ? decodeURIComponent(req.body.description)  : null,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  };
  
  eventValidation(event, function(err) {
    if (err) {
      var error = new errors.ValidationError('Event creation failed', err);
      return next(error);
    }
    dao.setByAndIncrementKey(keys.eventsId, keys.eventKey, event, function(err, key) {
      if (err) {
        return next(err);
      }
      else {
        dao.setByKey(keys.eventsKey, key, 'set', function(err) {
          res.json(key);
        });
      }
    });
  });
}

exports.getByKey = function(req, res, next) {
  var key = req.params.eventKey;
  dao.getByKey(key, 'hash', function(err, event) {
    if (err) { return next(err);}
    res.json(event, 200);
  });

}

exports.notFound = function(req, res) {
  res.json ('Event not found', 404);
}

function eventValidation(event, callback) {
  var err = [];
  if (!event) { err.unshift({msg: 'No event to validate'});}
  if (!event.name) { err.unshift({msg: 'missing parameter', parameter: 'name'});}
  if (!event.description) { err.unshift({msg: 'missing parameter', parameter: 'description'});}
  if (!event.location) { err.unshift({msg: 'missing parameter', parameter: 'location'});}
  if (!event.startDate) { err.unshift({msg: 'missing parameter', parameter: 'startDate'});}
  if (event.startDate && !validation.validateISO8601(event.startDate)) {
    err.unshift({msg: 'Requires ISO8601 Format', parameter: 'startDate'});
  }
  if (!event.endDate) { err.unshift({msg: 'missing parameter', parameter: 'endDate'})}
  if (event.endDate && !validation.validateISO8601(event.endDate)) {
    err.unshift({msg: 'Requires ISO8601 Format', parameter: 'endDate'});
  }
  if (err.length == 0) { err = null;}
  return callback(err);
}
