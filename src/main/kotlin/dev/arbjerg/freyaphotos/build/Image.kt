package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Collection
import dev.arbjerg.freyaphotos.exif.Metadata
import java.nio.file.Path
import kotlin.io.path.name

data class Image(
    val inputPath: Path,
    val outputPath: Path,
    val metadata: Metadata,
    val collection: Collection
) {
    val originalWebPath = "/img/${collection.name}/${outputPath.name}"
    val smallThumbWebPath = originalWebPath
    val largeThumbWebPath = originalWebPath
}