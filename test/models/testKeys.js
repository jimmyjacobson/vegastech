var redis = require("redis")
  , db = redis.createClient()
  , should = require("should")
  , errors = require('../../errors');
  
var dao = require('../../models/databaseObject');
dao.setDatabase(db);

describe('Tests on keys', function(){
  
  before(function(done){
    db.sadd('set:not:string', 1);
    db.set('id', 0);
    db.set("key:should:exist", 1, function(err) {
      done();
    });
  });
  
  describe('Getting a value by a nonexistent key and specifying type', function() {
    it('should return Not Found error', function(done) {
      dao.getByKey('this:key:does:not:exist', 'string', function(err, string) {
        err.should.exist;
        err.should.be.instanceof(errors.NotFound);
        done()
      });
    });
  });
  
  describe('Getting a value by an existing key and specifying type', function() {
    it('should return the value of the key', function(done) {
      dao.getByKey('key:should:exist', 'string', function(err, string) {
        string.should.exist;
        string.should.equal('1');
        done();
      });
    });
  });
  
  describe('Getting a value by a nonexistent key without specifying the type', function() {
    it('should return a NotFound error', function(done) {
      dao.getByKey('key:should:not:exist', function(err, string) {
        err.should.exist;
        err.should.be.instanceof(errors.NotFound);
        done();
      });
    });
  });
  
  describe('Getting a value by an existing key without specifying the type', function() {
    it('should return the value of the key', function(done) {
      dao.getByKey('key:should:exist', function(err, string) {
        string.should.exist;
        string.should.equal('1');
        done();
      });
    });
  });
  
  describe('Get value by key using getString wrapper', function() {
    it('should return the value of the key', function(done) {
      dao.getString('key:should:exist', function(err, string) {
        string.should.exist;
        string.should.equal('1');
        done();
      });
    });
  });
  
  describe('Set a string with a key', function() {
    it('should set a string', function(done) {
      dao.setByKey('foo', 'bar', function(err) {
        dao.getString('foo', function(err, string) {
          string.should.exist;
          string.should.equal('bar');
          done();
        });
      });
    });
  });
  
  describe('Increment a key by 1', function() {
    it('should increment the key by 1', function(done) {
     dao.incrementKey('increment:key', function(err, value) {
       value.should.exist;
       value.should.equal(1);
       done();
     });
    });
  });
  
  describe('Try to increment a key that already exists and is not a string', function() {
    it('should return an error', function(done) {
      dao.incrementKey('set:not:string', function(err, value) {
        err.should.exist;
        done();
      });
    });
  });
  
  describe('Increment key and set the object', function() {
    it('should increment the key and set the value', function(done) {
      dao.setByAndIncrementKey('id', 'incr:by:', 'foo', function(err, value) {
        value.should.exist;
        value.should.equal('incr:by:1');
        dao.getByKey('id', function(err, value) {
          value.should.equal('1');
          dao.getByKey('incr:by:1', function(err, value) {
            value.should.equal('foo');
            done();
          });
        })
      });
    });
  });
  
  after(function() {
     db.flushall();
   });
});