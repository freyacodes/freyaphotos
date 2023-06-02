package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Lib
import dev.arbjerg.freyaphotos.child
import dev.arbjerg.freyaphotos.exif.Metadata
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

object Builder {
    fun build() {
        if (Lib.isNetlify) println("Running in Netlify")

        Lib.buildDir.mkdir()
        Lib.buildDir.listFiles()!!.forEach {
            if (it.name == "img") return@forEach
            it.deleteRecursively()
        }

        Lib.imageOutDir.mkdir()

        val images = Lib.publicImagesDir.listFiles()!!
            .filter { it.name.endsWith(".jpg") }
            .map {
                val name = it.nameWithoutExtension
                val metaFile = Lib.metaDir.child(it.nameWithoutExtension + ".json")
                val meta = if (metaFile.exists()) {
                    Json.decodeFromString<Metadata>(metaFile.readText())
                } else {
                    Metadata(it.nameWithoutExtension)
                }
                Image(it, meta)
            }
        Assembler.buildCollection("All images", images);
    }
}
