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
        var path   = url.parse(req.url, true).path;
        var pos    = ring.getNode(path);
        var dest   = hosts[pos];
        var client = net.connect(dest.port, dest.host);
        bounce(client);
    };
};