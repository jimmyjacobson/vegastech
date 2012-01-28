
/**
 * Module dependencies.
 */
var redis = require("redis")
  , db = redis.createClient();
  
var dao = require('./models/databaseObject').setDatabase(db);

var express = require('express')
  , routes = require('./routes')
  , events = require('./routes/events')
  , people = require('./routes/people')
  , errors = require('./errors');
 

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
//  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.use(errors.errorHandling);
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/favicon.ico', function(req, res) { res.json('seriously?', 403); })

app.post('/event', events.create);
app.post('/person', people.create);

//default routes
app.all('*', routes.headers);
app.get('/', routes.index);
app.get(/^(.*)$/, routes.getByKey);


process.on('uncaughtException', function(err) {
	console.log('uncaughtException:' + err);
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
