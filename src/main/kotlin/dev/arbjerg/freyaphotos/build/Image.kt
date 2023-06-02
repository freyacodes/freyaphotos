package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.exif.Metadata
import java.io.File

data class Image(
    val file: File,
    val metadata: Metadata
)