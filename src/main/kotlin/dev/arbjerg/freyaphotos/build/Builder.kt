package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Collection
import dev.arbjerg.freyaphotos.Lib
import java.nio.file.Files
import kotlin.io.path.ExperimentalPathApi
import kotlin.io.path.createDirectories
import kotlin.io.path.deleteRecursively
import kotlin.io.path.listDirectoryEntries

object Builder {
    @OptIn(ExperimentalPathApi::class)
    fun build() {
        if (Lib.isNetlify) println("Running in Netlify")

        Lib.buildDir.listDirectoryEntries().forEach {
            it.deleteRecursively()
        }
        Lib.galleryDir.createDirectories()

        val collections = Collection.resolve()
        collections.forEach { c ->
            c.imageOutPath.createDirectories()
            c.images.forEach { i ->
                Files.createLink(i.outputPath, i.inputPath)
            }
        }

        collections.forEach(Assembler::buildCollection)
    }
}
