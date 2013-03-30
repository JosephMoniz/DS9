var net      = require("net");
var url      = require("url");
var hashring = require("hashring");
var router   = require("../util/router");

module.exports = function(options, pool) {
    if (!options.param) {
        return null;
    }

    var key   = options.param;
    var ring  = new hashring();
    var hosts = router.updateRing(ring, [], pool.getHosts());

    pool.on("revised", function(nodes) {
        hosts = router.updateRing(ring, hosts, nodes);
    });

    return function(req, bounce) {
        var query  = url.parse(req.url, true).query;
        var pos    = ring.getNode(query[key]);
        var dest   = hosts[pos];
        var client = net.connect(dest.port, dest.host);
        bounce(client);
    };
};