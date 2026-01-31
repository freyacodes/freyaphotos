package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Collection
import dev.arbjerg.freyaphotos.exif.Metadata
import java.nio.file.Path
import kotlin.io.path.name
import kotlin.io.path.notExists

data class Image(
    val inputPath: Path,
    val outputPath: Path,
    val metadata: Metadata,
    val collection: Collection
) {
    val originalWebPath = "/img/${collection.name}/${outputPath.name}"
    val smallThumbWebPath = "/img/${collection.name}/small/${outputPath.name}"
    val largeThumbWebPath = "/img/${collection.name}/large/${outputPath.name}"

    fun createThumbnails() {
        val smallPath = outputPath.parent.resolve("small/${outputPath.name}")
        val largePath = outputPath.parent.resolve("large/${outputPath.name}")
        if (smallPath.notExists()) ImageMagick.createSmallThumbnail(inputPath, smallPath, metadata)
        if (largePath.notExists()) ImageMagick.createLargeThumbnail(inputPath, largePath)
    }
}