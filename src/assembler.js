const fs = require("fs-extra");
const cheerio = require("cheerio");
const sass = require("sass");
const lib = require("./lib");

const baseTemplate = buildBase()

function buildBase() {
    const $ = cheerio.load(lib.templateBase);
    $("#style").text(sass.compile("templates/style/style.sass").css);
    console.log("Compiled styles")
    return $.html();
}


exports.buildCollection = function () {
    fs.writeFileSync(lib.buildDir + "index.html", baseTemplate);
    console.log("Wrote index.html")
}