var dao = require('../models/databaseObject');
var errors = require('../errors');

exports.createRouteObject = function(object) {
  return RouteObject(object);
}

function RouteObject(object) {
  this.model = object;
}
  
RouteObject.prototype.index = function(req, res){
  dao.getAndExpandCollection(model.keys['setKey'], 'set', function(err, collection) {
    res.json(collection, 200);
  })
}

RouteObject.prototype.create = function(req, res, next) {

  var object = new model.parse(req);
  
  object.validator(object, function(err) {
    if (err) {
      return next(new errors.ValidationError(err));
    }
    dao.setByAndIncrementKey(model.keys['idsKey'], model.keys['setKey'], object, function(err, key) {
      if (err) {
        return next(err);
      }
      else {
        dao.setByKey(model.keys['objectKey'], key, 'set', function(err) {
          res.json(key);
        });
      }
    });
  });
}

RouteObject.prototype.getByKey = function(req, res, next) {
  var key = req.params.key;
  dao.getByKey(key, 'hash', function(err, event) {
    if (err) { return next(err);}
    res.json(event, 200);
  });

}

RouteObject.notFound = function(req, res) {
  res.json ('not found', 404);
}


