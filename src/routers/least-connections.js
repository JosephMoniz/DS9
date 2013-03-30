var net    = require("net");
var router = require("../util/router");

var _strToHost = function(str) {
    var peices = router.strToHost(str);
    peices.connections = 0;
    return peices;
};

var _getNodeWithLeastConnections = function(nodes) {
    var result = Object.keys(nodes).reduce(function(memo, n) {
        if (!memo || memo.connections > nodes[n].connections) {
            memo = nodes[n];
            memo.key = n;
            return memo;
        } else {
            return memo;
        }
    }, null);

    if (result) {
        return result.key;
    } else {
        return null;
    }
};

module.exports = function(options, pool) {
    var connections = {};
    var hosts       = pool.getHosts();
    var hostMap     = hosts.map(_strToHost);

    pool.on("revised", function(nodes) {
        var add    = router.difference(nodes, hosts);
        var remove = router.difference(hosts, nodes);
        add.forEach(function(n) {
            hostMap[n] = _strToHost(n);
        });
        remove.forEach(function(n) {
            if (hostMap[n]) {
                delete hostMap[n];
            }
        });
    });

    return function(req, bounce) {
        var pos = _getNodeWithLeastConnections(hostMap);
        if (!pos) {
            return req.end();
        }
        hostMap[pos].connections++;
        var dest   = hostMap[pos];
        var client = net.connect(dest.port, dest.host);
        bounce(client);
        client.on("end", function() {
            if (hostMap[pos]) {
                hostMap[pos].connectoins--;
            }
        });
    };
};