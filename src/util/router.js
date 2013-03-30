var self = module.exports = {

    strToHost: function(str) {
        var peices = str.split(":");
        if (peices.length > 1) {
            return {
                host: peices[0],
                port: peices[1]
            };
        } else {
            return {
                host: peices[0],
                port: 80
            };
        }
    },

    difference: function(a, b) {
        return a.filter(function(n) { return b.indexOf(n) === -1; });
    },

    updateRing: function(ring, oldNodes, newNodes) {
        var add    = self.difference(newNodes, oldNodes);
        var remove = self.difference(oldNodes, newNodes);
        add.forEach(function(n) {
            ring.addServer(n, 20);
        });
        remove.forEach(function(n) {
            ring.removeServer(n);
        });
        return newNodes.reduce(function(memo, n) {
            memo[n] = self.strToHost(n);
            return memo;
        }, {});
    }

};