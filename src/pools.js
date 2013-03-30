var utilLoader = require("./util/loader");

module.exports = function(rules) {
    var pools  = utilLoader("./pools");
    var pooled = rules.map(function(rule) {
        var pool = rule.pool;
        if (!pool || !pool.type || !pools[pool.type]) {
            rule.pool = null;
        } else {
            rule.pool = pools[pool.type](pool);
        }
        return rule;
    });
    var invalid = pooled.some(function(rule) {
        return rule.pool === null;
    });
    if (invalid) {
        return null;
    } else {
        return pooled;
    }
};