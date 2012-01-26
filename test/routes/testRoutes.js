var redis = require("redis")
  , db = redis.createClient()
  , should = require("should")
  , errors = require('../../errors');
  
var dao = require('../../models/databaseObject');
dao.setDatabase(db);

var RouteObject = require('../../routes/routeObject');
var route = new RouteObject({
  keys: {
    idsKey; 'ids:object',
    objectKey: 'objects:object:',
    setkey: 'objects'
  },
  parse = function(req) {
    var object = {}
    object.property1 = req.params.property1;
    object.property2 = req.params.property2;
    object.property3 = req.params.property3;
    
    return object;
  },
  validator = function(object, callback) {
    if (!object) { callback(new errors.ValidationError())}
    callback(null);
  }
});



describe('Tests on route object', function(){
  
  before(function(done){
   db.hmset(route.keys['objectKey'] + '1', {
     property1: 'foo1',
     property2: 'foo2',
     property3: 'foo3'
   });
   db.set(route.keys['ids:object'], 2);
  });
  
  describe('create new object', function() {
    it('should get a object', function(done) {
      var req = {};
      var res = {};
      req.params.key = 'objects:object:1';
      route.getByKey(req, res) {
        
        done();
      }
    });
  });
  
  after(function() {
    db.flushall();
  });
});