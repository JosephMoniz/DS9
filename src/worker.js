var bouncy   = require("bouncy");
var matchers = require("./matchers");

module.exports = function(config) {
    var rules   = matchers(config.rules);
    var bouncer = bouncy(rules);
    bouncer.listen(80);
};