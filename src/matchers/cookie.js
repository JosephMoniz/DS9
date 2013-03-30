var self = module.exports = {
    validator: function(value) {
        if (value.constructor.name != "Object") {
            return false;
        }
        if (!value.key || value.header.constructor.name != "String") {
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
            var pattern = new RegExp("(" + value.key + ")=([^;]+)");
            return function(req) {
                var cookies = req.headers.Cookie;
                if (!cookies) {
                    return false;
                }
                var match = cookies.match(pattern);
                if (!match) {
                    return false;
                }
                return !!match[2].match(value.value);
            };
        case "String":
            var pattern = new RegExp("(" + value.key + ")=([^;]+)");
            return function(req) {
                var cookies = req.headers.Cookie;
                if (!cookies) {
                    return false;
                }
                var match = cookies.match(pattern);
                if (!match) {
                    return false;
                }
                return match[2] == value.value;
            };
        default:
            return function() { return false; };
        }
    }
};