package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Lib
import dev.arbjerg.freyaphotos.child
import dev.arbjerg.freyaphotos.exif.Metadata
import kotlinx.serialization.json.Json
import java.nio.file.Files

object Builder {
    fun build() {
        if (Lib.isNetlify) println("Running in Netlify")

        Lib.buildDir.mkdir()
        Lib.buildDir.listFiles()!!.forEach {
            it.deleteRecursively()
        }

        Lib.imageOutDir.mkdir()

        val images = Lib.publicImagesDir.listFiles()!!
            .filter { it.name.endsWith(".jpg") }
            .map {
                val newPath = Lib.imageOutDir.child(it.name)
                Files.createLink(newPath.toPath(), it.toPath())
                val metaFile = Lib.metaDir.child(it.nameWithoutExtension + ".json")
                val meta = if (metaFile.exists()) {
                    Json.decodeFromString<Metadata>(metaFile.readText())
                } else {
                    Metadata(it.nameWithoutExtension)
                }
                Image(newPath, meta)
            }
        Assembler.buildCollection("All images", images);
    }
}
