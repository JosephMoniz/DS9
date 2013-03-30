var EventEmitter = require("events").EventEmitter;
var zkWrapper    = require("../util/zookeeper");

var difference = function(a, b) {
    return a.filter(function(n) { return b.indexOf(n) === -1; });
};

module.exports = function(pool) {
    if (!pool.hosts || !pool.path) {
        return null;
    }

    var self  = new EventEmitter();
    var hosts = [];

    var zkHosts = pool.hosts.map(function(n) {
        var peices = n.split(":");
        return {
            host: peices[0],
            port: parseInt(peices[1])
        };
    });
    var zookeeper = zkWrapper(zkHosts);
    zookeeper.readdir(pool.path, function(error, nodes) {
        if (error) {
            console.log("zookeeper error");
            process.exit(1);
        }
        hosts = nodes;
        self.emit("revised", nodes);
        zookeeper.watch(pool.path, { method: "list" }, function(err, emitter) {
            emitter.on("error", function() {
                console.log("zookeeper error");
                process.exit(1);
            });
            emitter.on("children", function(nodes) {
                hosts = nodes;
                self.emit("revised", nodes);
            });
        });
    });

    self.getHosts = function() {
        return hosts;
    };

    return self;
};