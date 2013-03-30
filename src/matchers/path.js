var url = require("url");

var self = module.exports = {
    validator: function(value) {
        switch(value.constructor.name) {
        case "RegExp": return true;
        case "String": return true;
        case "Array":  return value.every(function(n) {
            return self.validator(n);
        });
        default:       return false;
        }
    },
    generator: function(value) {
        switch(value.constructor.name) {
        case "RegExp":
            return function(req) {
                return url.parse(req.url).pathname == value;
            };
        case "String":
            return function(req) {
                return url.parse(req.url).pathname.match(value);
            };
        case "Array":
            var peices = value.map(self.generator);
            return function(req) {
                var path = url.parse(req.url).pathname;
            return peices.some(function(matcher) {
                return matcher(path);
            });
            };
        default:
            return function() { return false; };
        }
    }
};