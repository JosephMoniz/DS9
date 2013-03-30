var url         = require("url");
var querystring = require("querystring");

var self = module.exports = {
    validator: function(value) {
        if (value.constructor.name != "Object") {
            return false;
        }
        if (value.key.constructor.name != "String") {
            return false;
        }
        switch(value.value.constructor.name) {
        case "String":
        case "RegExp": return true;
        default:       return false;
        }
    },
    generator: function(value) {
        switch(value.value.constructor.name) {
        case "String":
            return function(req) {
                var query = url.parse(req.url, true).query;
                return query[value.key] && query[value.key] = value.value;
            };
        case "RegExp":
            return function(req) {
                var query = url.parse(req.url, true).query;
                return query[value.key] && query[value.key].match(value.value);
            };
        default:
            return function() { return false; };
        }
    }
}