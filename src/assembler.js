const fs = require("fs-extra");
const cheerio = require("cheerio");
const sass = require("sass");
const lib = require("./lib");

const baseTemplate = buildBase()
const galleryTemplate = fs.readFileSync(lib.templateDir + "gallery/gallery.html")
const cardTemplate = fs.readFileSync(lib.templateDir + "gallery/card.html")

function buildBase() {
    const $ = cheerio.load(lib.templateBase);
    $("#style").text(sass.compile("templates/style/style.sass").css);
    console.log("Compiled styles")
    return $.html();
}

exports.buildCollection = function (collectionName, images) {
    const $ = cheerio.load(baseTemplate);
    $("#content").html(galleryTemplate);
    $("#gallery-title").text(collectionName);

    for (const image of images) {
        const card = cheerio.load(cardTemplate);
        card(".metadata").html("<p>" + image + "</p>")
        card(".thumbnail").css("background-image", "url(/img/thumbs/" + image + ")")
        card(".gallery-card").attr("href", "/img/" + image)
        $("#gallery-cards").append(card.html());
    }

    fs.writeFileSync(lib.buildDir + "index.html", $.html());
    console.log("Wrote index.html")
}
