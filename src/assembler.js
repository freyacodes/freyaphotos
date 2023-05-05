const fs = require("fs-extra");
const cheerio = require("cheerio");
const sass = require("sass");
const lib = require("./lib");

const baseTemplate = buildBase()
const galleryTemplate = fs.readFileSync(lib.templateDir + "gallery/gallery.html")

function buildBase() {
    const $ = cheerio.load(lib.templateBase);
    $("#style").text(sass.compile("templates/style/style.sass").css);
    console.log("Compiled styles")
    return $.html();
}


exports.buildCollection = function () {
    const $ = cheerio.load(baseTemplate);
    $("#content").html(galleryTemplate);
    fs.writeFileSync(lib.buildDir + "index.html", $.html());
    console.log("Wrote index.html")
}