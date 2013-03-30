var async  = require("async");
var zkplus = require("zkplus");

var connector = async.memoize(function(servers, next) {
    var client = zkplus.createClient({
        servers: servers,
        timeout: 1000
    });
    client.on("connect", function() {
        next(null, client);
    });
});

var wrapper = function(servers, method) {
    return function() {
        var args = arguments;
        var next = arguments[arguments.length - 1];
        connector(servers, function(error, keeper) {
            if (error) {
                next(error);
            } else {
                keeper[method].apply(keeper, args);
            }
        });
    };
};

module.exports = function(servers) {
    return {
        creat:    wrapper(servers, "creat"),
        get:      wrapper(servers, "get"),
        getState: wrapper(servers, "getState"),
        mkdirp:   wrapper(servers, "mkdirp"),
        put:      wrapper(servers, "put"),
        readdir:  wrapper(servers, "readdir"),
        rmr:      wrapper(servers, "rmr"),
        stat:     wrapper(servers, "stat"),
        unlink:   wrapper(servers, "unlink"),
        update:   wrapper(servers, "update"),
        watch:    wrapper(servers, "watch")
    };
};
