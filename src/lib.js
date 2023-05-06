const fs = require("fs-extra");

exports.buildDir = "build/";
exports.imageOutDir = "build/img/";
exports.publicImagesDir = "data/public/";
exports.templateDir = "templates/";
exports.templateBase = fs.readFileSync("templates/base.html");
exports.staticDir = "static/";
