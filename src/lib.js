const fs = require("fs-extra");

exports.buildDir = "build/";
exports.templateDir = "templates/";
exports.templateBase = fs.readFileSync("templates/base.html");
exports.staticDir = "static/";
