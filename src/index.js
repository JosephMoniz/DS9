var os           = require("os");
var cluster      = require("cluster");
var configLoader = require("./config/loader");
var matchers     = require("./matchers");
var worker       = require("./worker");

if (cluster.isMaster) {
    var workers = os.cpus().length;
    var config  = configLoader(process.argv[2]);
    if (!config) {
        process.stderr.write("Failed loading config.\n");
        process.exit(1);
    }
    var rules = matchers(config.rules);
    if (!rules) {
        process.stderr.write("Failed processing config.\n");
        process.exit(1);
    }
    var args = { config: process.argv[2] };
    for (var i = 0; i < workers; i++) {
        cluster.fork(args);
    }
    cluster.on("exit", function() {
        cluster.fork(args);
    });
} else {
    worker(configLoader(process.env.config));
}