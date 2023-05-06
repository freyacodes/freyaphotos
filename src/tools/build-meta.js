const exifr = require("exifr");
const fs = require("fs-extra");
const lib = require("../lib.js");

const options = {
    mergeOutput: false,
    iptc: true,
    icc: true,
    xmp: true,
    iptc: true
};

const sidecars = {};

traverse(lib.sidecarDir, findSidecars);
console.log("Found " + Object.keys(sidecars).length + " sidecars")
traverse(lib.publicImagesDir, buildMeta);

function findSidecars(dir, file) {
    if (file.name.endsWith(".ARW.xmp")) {
        sidecars[file.name.replace(".ARW.xmp", "", file.path)] = dir + "/" + file.name
    }
}

function buildMeta(dir, file) {
    const meta = {};
}

function traverse(path, func) {
    const files = fs.readdirSync(path, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) {
            func(path, file);
        } else if (file.isDirectory()) {
            traverse(path + "/" + file.name, func);
        }
    }
}

//exifr.parse("/home/freya/photos/exports/DSC01454.jpg", options)
//exifr.sidecar("/home/freya/photos/2022/DSC01311.ARW.xmp")
//    .then(output => console.log(output))