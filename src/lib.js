const fs = require("fs-extra");

exports.buildDir = "build/";
exports.templateBase = fs.readFileSync("templates/base.html");
exports.staticDir = "static/";
