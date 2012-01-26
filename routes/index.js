
exports.headers = function(req, res, next) {
  res.setHeader("x-vegastech-api-version", "0.0.1");
  next();
}

exports.index = function(req, res){
  res.json({ msg: 'Welcome to Vegas Tech API' });
};