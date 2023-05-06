const fs = require("fs-extra")
const lib = require("./lib.js")
const assembler = require("./assembler.js")

fs.ensureDirSync(lib.buildDir);
//for (const file of fs.readdirSync(lib.buildDir)) { 
//    fs.removeSync(lib.buildDir + file);
//}
//for (const file of fs.readdirSync(lib.staticDir)) { 
//    fs.copySync(lib.staticDir + file, lib.buildDir + file);
//}

assembler.buildCollection();
