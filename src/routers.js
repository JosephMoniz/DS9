var utilLoader = require("./util/loader");
var pools      = require("./pools");

module.exports = function(rules) {
    var routers = utilLoader("./routers");
    var pooled  = pools(rules);
    if (!pooled) {
        return null;
    }
    var routed = pooled.map(function(rule) {
        var router = rule.routing;
        if (!router || !router.method) {
            router = { method: "least-connections" };
        }
        if (!routers[router.method]) {
            rule.router = null;
        } else {
            rule.router = routers[router](router, rule.pool);
        }
        return rule;
    });
    var invalid = routed.some(function(rule) {
        return rule.routed === null;
    });
    if (invalid) {
        return null;
    } else {
        return routed;
    }
};
