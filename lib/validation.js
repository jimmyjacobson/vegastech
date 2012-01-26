exports.validateISO8601 = function(date) {
  var regex = /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])(\D?([01]\d|2[0-3])\D?([0-5]\d)\D?([0-5]\d)?\D?(\d{3})?)?$/;
  var result = date.match(regex);
  if (!result || result.length == 0) {
    return false;
  }
  return true;
}