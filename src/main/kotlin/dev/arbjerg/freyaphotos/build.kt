package dev.arbjerg.freyaphotos

import java.nio.file.Files

fun build() {
    Lib.buildDir.mkdir()
    Lib.buildDir.listFiles()!!.forEach {
        if (it.name == "img") return@forEach
        it.deleteRecursively()
    }

    Lib.imageOutDir.mkdir()
    Lib.imageThumbsOutDir.mkdir()

    Lib.publicImagesDir.listFiles()!!.forEach {
        if (Lib.imageThumbsOutDir.child(it.name).exists()) return@forEach
        Files.createLink(Lib.imageOutDir.child(it.name).toPath(), it.toPath())

        val code = Runtime.getRuntime().exec(
            "convert ${it.absolutePath} -gravity center -scale 350x350^ -extent 350x350 "
                    + Lib.imageThumbsOutDir.child(it.name).absolutePath
        ).waitFor()
        if (code != 0) error("Exit code $code")
        println("Wrote thumbs/${it.name}")
    }

    val images = Lib.publicImagesDir.listFiles()!!.filter { it.name.endsWith(".jpg", true) }
    Assembler.buildCollection("All images", images);
}