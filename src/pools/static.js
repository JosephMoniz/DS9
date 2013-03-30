var EventEmitter = require("events").EventEmitter;

module.exports = function(pool) {
    if (!pool.hosts) {
        return null;
    }

    var self  = new EventEmitter();

    self.getHosts = function() {
        return pool.hosts;
    };

     return self;
};