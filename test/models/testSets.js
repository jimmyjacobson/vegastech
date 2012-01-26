var redis = require("redis")
  , db = redis.createClient()
  , should = require("should")
  , errors = require('../../errors');
  
var dao = require('../../models/databaseObject');
dao.setDatabase(db);

describe('Tests on sets', function(){
  
  before(function(done){
    db.sadd("set:should:exist", 1);
    db.sadd("set:should:exist", 2);
    db.sadd('ids', 'hash:id:1');
    db.sadd('ids', 'hash:id:2');
    db.hmset('hash:id:1', {foo: '1', bar: '2'});
    db.hmset('hash:id:3', {foo: '5', bar: '6'});
    db.hmset('hash:id:2', {foo: '3', bar: '4'}, function(err) {
      done();
    });
  });
  
  describe('Get set without specifying type', function() {
    it('should return a set', function(done) {
      dao.getByKey('set:should:exist', function(err, set) {
        should.not.exist(err);
        set.should.exist;
        done();
      })
    });
  });
  
  describe('Get set by specifying type', function() {
    it('should return a set', function(done) {
      dao.getByKey('set:should:exist', 'set', function(err, set) {
        should.not.exist(err);
        set.should.exist;
        done();
      })
    });
  });
  
  describe('get set and expand objects', function() {
    it('should return a set', function(done) {
      db.keys('hash:id:*', function(err, set) {
        should.not.exist(err);
        set.should.exist;
        dao.expandCollection(set, function(err, objects) {
          objects.should.exist;
          objects.length.should.equal(3);
          done();
        });
      })
    });
  });
  
  describe('get expanded set', function() {
    it('should return a set', function(done) {
      dao.getAndExpandCollection('ids', 'set', function(err, objects) {
        objects.should.exist;
        done();
      });
    });
  })
  
  after(function() {
    db.flushall();
  });
});