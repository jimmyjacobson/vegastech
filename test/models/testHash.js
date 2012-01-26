var redis = require("redis")
  , db = redis.createClient()
  , should = require("should")
  , errors = require('../../errors');
  
var dao = require('../../models/databaseObject');
dao.setDatabase(db);

var foobar = {foo: '1', bar: '2'};

describe('Tests on hashes', function(){
  
  before(function(done){
    db.hmset("hash:should:exist", foobar, function(err) {
      done();
    });
  });
  
  describe('Get hash by nonexistent key', function() {
    it('should return Not Found', function(done) {
      dao.getByKey('key:not:found', 'hash', function(err) {
        err.should.exist;
        err.should.be.instanceof(errors.NotFound);
        done();
      });
    });
  });
  
  describe('Get Hash by ID', function() {
    it('should return a hash', function(done) {
      dao.getByKey('hash:should:exist', function(err, hash) {
        hash.should.exist;
        done();
      });
    });
  });
  
  describe('Get Hash by ID and Type', function() {
    it('should return a hash', function(done) {
      dao.getByKey('hash:should:exist', 'hash', function(err, hash) {
        hash.should.exist;
        done();
      });
    });
  });
  
  describe('Get hash by getHash convenience wrapper', function() {
    it('should return a hash', function(done) {
      dao.getHash('hash:should:exist', function(err, hash) {
        hash.should.exist;
        done();
      });
    });
  });
  
  describe('Write hash to a key', function() {
    it('should write a hash to the key', function(done) {
      var hashName = 'setting:this:hash';
      dao.setByKey(hashName, foobar, function(err) {
        dao.getHash('hash:should:exist', function(err, hash) {
          hash.should.exist;
          done();
        });
      })
    });
  });
  
  after(function() {
    db.flushall();
  });
});