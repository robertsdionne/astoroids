
var bind = function(func, target) {
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      func.apply(target, newArgs);
    };
  } else {
    return function() {
      return func.apply(target, arguments);
    };
  }
};

var nullFunc = function() {};
