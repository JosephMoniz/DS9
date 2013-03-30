var utilLoader = require("./util/loader");
var routers    = require("./routers");

var find = function(collection, iterator) {
    var result = undefined;
    collection.some(function(item) {
        if (iterator(item)) {
            result = item;
            return true;
        } else {
            return false;
        }
    });
    return result;
};

module.exports = function(rules) {
    var matchers = utilLoader("./matchers");
    var routed   = routers(rules);
    if (!routed) {
        return null;
    }
    var invalid = routed.some(function(rule) {
        var match = rule.match;
        if (!match) {
            return true;
        } else {
            return !Object.keys(match).every(function(matcher) {
                return matchers[matcher] &&
                       matchers[matcher].validator &&
                       matchers[matcher].generator &&
                       matchers[matcher].validator(match[matcher]);
            });
        }
    });
    if (invalid) {
        return null;
    }
    var matched = routed.map(function(rule) {
        var peices = Object.keys(rule.match).map(function(type) {
            return matchers[type].generator(rule.match[type]);
        });
        rule.match = function(req) {
            return peices.every(function(matcher) {
                return matcher(req);
            });
        };
        return rule;
    });
    return function(req, bounce) {
        var hit = find(matched, function(rule) { return rule.match(req); });
        if (hit) {
            hit.router(req, bounce);
        }
    };
};