const fs = require("fs-extra")
const lib = require("./lib.js")
const assembler = require("./assembler.js")
const child_process = require("child_process");

fs.ensureDirSync(lib.buildDir);
for (const file of fs.readdirSync(lib.buildDir)) {
    if (file === "img") continue
    fs.removeSync(lib.buildDir + file);
}
//for (const file of fs.readdirSync(lib.staticDir)) { 
//    fs.copySync(lib.staticDir + file, lib.buildDir + file);
//}

fs.ensureDirSync(lib.imageOutDir);
fs.ensureDirSync(lib.imageThumbsOutDir);
for (const file of fs.readdirSync(lib.publicImagesDir)) {
    if (fs.existsSync(lib.imageOutDir + file)) continue
    fs.link(lib.publicImagesDir + file, lib.imageOutDir + file)
    child_process.execSync("convert " + lib.publicImagesDir + file + " -gravity center -scale 300x300^ -extent 300x300 " + lib.imageThumbsOutDir + file)
    console.log("Wrote " + lib.imageThumbsOutDir + file)
}

assembler.buildCollection("All images", fs.readdirSync(lib.publicImagesDir));
