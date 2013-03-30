var net    = require("net");
var router = require("../util/router");

module.exports = function(options, pool) {
    var hosts = pool.getHosts().map(router.strToHost);

    pool.on("revised", function(nodes) {
        hosts = nodes.map(router.strToHost);
    });

    return function(req, bounce) {
        var dest   = hosts[Math.floor(Math.random() * hosts.length)];
        var client = net.connect(dest.port, dest.host);
        bounce(client);
    };
};