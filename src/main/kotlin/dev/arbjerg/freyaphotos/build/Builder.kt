package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Collection
import dev.arbjerg.freyaphotos.Lib
import dev.arbjerg.freyaphotos.list
import java.nio.file.Files
import kotlin.io.path.*

object Builder {
    @OptIn(ExperimentalPathApi::class)
    fun build() {
        if (Lib.isNetlify) println("Running in Netlify")

        Lib.buildDir.createDirectories()
        // Delete everything but thumbs
        Lib.buildDir.listDirectoryEntries().forEach { f ->
            if (f.name == "img") f.list()
                .flatMap { it.list() }
                .forEach { if (it.isRegularFile()) it.deleteExisting() }
            else f.deleteRecursively()
        }
        Lib.galleryDir.createDirectories()

        val collections = Collection.resolve()
        collections.forEach { c ->
            c.imageOutPath.resolve("small").createDirectories()
            c.imageOutPath.resolve("large").createDirectories()
            c.images.forEach { i ->
                Files.createLink(i.outputPath, i.inputPath)
                i.createThumbnails()
            }
        }

        collections.forEach(Assembler::buildCollection)
    }
}
