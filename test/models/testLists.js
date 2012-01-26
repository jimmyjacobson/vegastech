var redis = require("redis")
  , db = redis.createClient()
  , should = require("should")
  , errors = require('../../errors');
  
var dao = require('../../models/databaseObject');
dao.setDatabase(db);



describe('Tests on lists', function(){
  
  before(function(done){
    db.lpush("list:should:exist", 1);
    db.lpush("list:should:exist", 2);
    db.lpush("list:should:exist", 3, function(err) {
      done();
    });
  });
  
  describe('Get list without specifying type', function() {
    it('should return a list', function(done) {
      dao.getByKey('list:should:exist', function(err, list) {
        should.not.exist(err);
        list.should.exist;
        done();
      });
    });
  });
  
  after(function() {
    db.flushall();
  });
});