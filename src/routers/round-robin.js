var net    = require("net");
var router = require("../util/router");

module.exports = function(options, pool) {
    var position = 0;
    var hosts    = pool.getHosts().map(router.strToHost);

    pool.on("revised", function(nodes) {
        hosts = nodes.map(router.strToHost);
    });

    return function(req, bounce) {
        var dest   = hosts[position];
        var client = net.connect(dest.port, dest.host);
        position   = (position + 1) % dest.length;
        bounce(client);
    };
};