var path            = require("path");
var directoryStream = require("directory-stream");
var reduceStream    = require("reductionist");

module.exports = function(target) {
    var directory = directoryStream.sync(target);
    var reader    = reduceStream(function(memo, n, next) {
        var key   = n.substring(target.length - 1, n.length - 3);
        memo[key] = require(path.join("../" + n));
        next(null, memo);
    }, {},  { every: false });
    var result = null;
    directory.pipe(reader).on("data", function(res) {
        result = res;
    });
    directory.resume();
    return result;
}