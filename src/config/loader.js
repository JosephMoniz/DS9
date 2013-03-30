var fs = require("fs");

module.exports = function() {
    try {
        return JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
    } catch(e) {
        return null;
    }
};