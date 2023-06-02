package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.exif.Metadata
import kotlinx.serialization.Serializable

@Serializable
class ManifestEntry(
    val meta: Metadata
) {
    var previous: String? = null
    var next: String? = null
}
