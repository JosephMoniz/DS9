var net      = require("net");
var url      = require("url");
var hashring = require("hashring");
var router   = require("../util/router");

var _getCookieValue = function(req, key) {
    var cookies = req.headers.Cookie;
    var pattern = new RegExp("(" + key + ")=([^;]+)");
    if (!cookies) {
        return null;
    }

    var match = cookies.match(pattern);
    if (!match) {
        return null;
    }

    return match[2];
};

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
        var pos     = ring.getNode(_getCookieValue());
        var dest    = hosts[pos];
        var client  = net.connect(dest.port, dest.host);
        bounce(client);
    };
};