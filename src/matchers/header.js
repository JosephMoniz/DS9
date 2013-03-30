var self = module.exports = {
    validator: function(value) {
        if (value.constructor.name != "Object") {
            return false;
        }
        if (!value.header || value.header.constructor.name != "String") {
            return false;
        }
        if (!value.value) {
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
        case "RegExp":
            return function(req) {
                var header = req.headers[value.header];
                return header && header == value.value;
            };
        case "String":
            return function(req) {
                var header = req.headers[value.header];
                return header && header.match(value.value);
            };
        default:
            return function() { return false; };
        }
    }
};