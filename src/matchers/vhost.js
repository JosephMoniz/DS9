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
                var host = req.headers.host;
                return host && host == value;
            };
        case "String":
            return function(req) {
                var host = req.headers.host;
                return host && host.match(value);
            };
        case "Array":
            var peices = value.map(self.generator);
            return function(req) {
                var host = req.headers.host;
                return peices.some(function(matcher) {
                    return matcher(host);
                });
            };
        default:
            return function() { return false; };
        }
    }
};