package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Lib

object Builder {
    fun build() {
        if (Lib.isNetlify) println("Running in Netlify")

        Lib.buildDir.mkdir()
        Lib.buildDir.listFiles()!!.forEach {
            if (it.name == "img") return@forEach
            it.deleteRecursively()
        }

        Lib.imageOutDir.mkdir()

        val images = Lib.publicImagesDir.listFiles()!!.filter { it.name.endsWith(".jpg", true) }
        Assembler.buildCollection("All images", images);
    }
}
