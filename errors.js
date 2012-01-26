exports.errorHandling = function(err, req, res, next) {
	if (err instanceof NotFound) {		
		res.json(err.json, 404);
	} 
	else if (err instanceof ValidationError) {
	  res.json(err.json, 403);
	}
	else {
		next(err);
	}
}

exports.NotFound = NotFound;
exports.ValidationError = ValidationError;
exports.DatabaseError = DatabaseError;

function NotFound(msg) {
  this.name = 'NotFound';
  this.statusCode = 404;
  this.textMessage = msg;
  
  this.json = {
    type: this.name,
    msg: this.textMessage
  };
  
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}
NotFound.prototype.__proto__ = Error.prototype;


function ValidationError (msg, errors) {
  this.name = 'ValidationError';
  this.statusCode = 403;
  this.textMessage = msg;
  this.errors = errors;
  
  this.json = {
    type: this.name,
    msg: this.textMessage,
    errors: this.errors
  };
  
  Error.call(this, this.textMessage);
  Error.captureStackTrace(this, arguments.callee);
}
ValidationError.prototype.__proto__ = Error.prototype;

function DatabaseError (errors) {
  this.name = 'DatabaseError';
  this.statusCode = 500;
  this.textMessage = "Database Error.";
  this.errors = errors;
  
  this.json = {
    type: this.name,
    msg: this.textMessage,
    errors: this.errors
  };
  
  Error.call(this, this.textMessage);
  Error.captureStackTrace(this, arguments.callee);
}
DatabaseError.prototype.__proto__ = Error.prototype;

