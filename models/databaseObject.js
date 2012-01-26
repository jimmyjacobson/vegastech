var errors = require('../errors');
var db;

exports.setDatabase = function(database) {
  db = database;
}
exports.getDatabase = function() {
  return db;
}

/*
Convenience methods
*/

exports.getString = function (key, callback) {
  exports.getByKey(key, 'string', callback);
}

var getHash = exports.getHash = function (key, callback) {
  exports.getByKey(key, 'hash', callback);
}

var getSet = exports.getSet = function(key, callback) {
  exports.getByKey(key, 'set', callback);
}

var getByKey = exports.getByKey = function(key, type, callback) {
  if (arguments.length == 2) {
    callback = type;
    db.type(key, function(err, type) {
      if (err) { return callback(err); }
      getByType(key, type, callback);
    });
  }
  else {
    getByType(key, type, callback);
  }
}

/*
  take an id or array of Ids and fetch theh hash associated with the object key and id
*/
var expandCollection = exports.expandCollection = function expandCollection (ids, callback) {
  if (!ids || (ids.length < 1)) {
    return callback(new errors.ValidationError('No Ids to expand'));
  }
  
  if (typeof(ids) == 'string') {
    var value = ids;
    ids = new Array();
    ids[0] = value;
  }
  
  var objects = []; 
  var errors = [];
  var i = ids.length;
  
  ids.forEach(function(id, index) {
    getByKey(id, 'hash', function(err, object) {
      if (err) {
        errors.unshift(err)
      }
      else {
        objects.unshift(object);
      }
      if (!--i) {
        return callback(errors, objects);
      }
    });
  });
}

var getAndExpandCollection = exports.getAndExpandCollection = function  (key, type, callback) {
  getByKey(key, type, function(err,collection) {
    if (err) { return callback(err); }
    expandCollection(collection, callback);
  });
}

// Private

function getByType(key, type, callback) {
  if (typeof getByTypeFns[type] !== 'function') {
    return callback(new errors.NotFound(key + ' not found'));
  }
  return getByTypeFns[type](key, callback);
}

// export this for unit test ability
var getByTypeFns = exports._getByTypeFns = {
  string: getByTypeString,
  hash: getByTypeHash,
  set: getByTypeSet,
  list: getByTypeList
};

function getByTypeString(key, callback) {
  db.get(key, function(err, string) {
    if (err) { return callback(err); }
    if (!string) {
      var error = new errors.NotFound([key + ' not found']);
      return callback(error);
    }
    return callback(null, string);
  });
};

function getByTypeHash(key, callback) {
  db.hgetall(key, function(err, hash) {
    if (err) { return callback(err); }
    if (Object.keys(hash).length == 0) {
      var error = new errors.NotFound([key + ' not found']);
      return callback(error);
    }
    hash.key = key;
    return callback(null, hash);  
  });
};

function getByTypeSet(key, callback) {
  db.smembers(key, function(err, set) {
    if (err) { return callback(err); }
    if (set.length == 0) {
      var error = new errors.NotFound([key + ' not found']);
      return callback(error);
    }
    return callback(null, set);
  });
}

function getByTypeList(key, callback) {
  db.lrange(key, 0, -1, function(err, list) {
    if (err) { return callback(err); }
    if (list.length == 0) {
      var error = new errors.NotFound([key + ' not found']);
      return callback(error);
    }
    return callback(null, list);
  });
}

/* 
  Writing
*/
var setByKey = exports.setByKey = function(key, value, type, callback) {
  if (arguments.length == 3) {
    callback = type;
    type = typeof(value);
  }
  if (typeof setByTypeFns[type] !== 'function') {
    return callback(new errors.DatabaseError([type + ' not supported Redis type']));
  }
  return setByTypeFns[type](key, value, callback);
}

var setByAndIncrementKey = exports.setByAndIncrementKey = function(idKey, key, value, callback) {
  db.incr(idKey, function(err, id) {
    if (err) { return callback(err);}
    var newKey = key + id;
    setByKey(newKey, value, function(err) {
      if (err) {return callback(err);}
      callback(null, newKey);
    });
  });
}

var setByTypeFns = exports._setByTypeFns = {
  string: setByTypeString,
  object: setByTypeHash,
  set: setByTypeSet
  
}

function setByTypeString (key, value, callback) {
  db.set(key, value, callback);
}

function setByTypeHash (key, hash, callback) {
  db.hmset(key, hash, callback);
}

function setByTypeSet (key, value, callback) {
  db.sadd(key, value, callback);
}

/*
incrementing
*/

var incrementKey = exports.incrementKey = function(key, value, callback) {
  if (arguments.length == 2) {
    callback = value;
    value = 1;
  }
  db.incrby(key, value, function(err, value) {
    if (err) { return callback(err);}
    callback(null, value);
  });
}

