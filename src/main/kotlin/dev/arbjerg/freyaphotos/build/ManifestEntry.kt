package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.exif.Metadata
import kotlinx.serialization.Serializable

@Serializable
class ManifestEntry(
    val meta: Metadata,
    val url: String
) {
    var previous: String? = null
    var next: String? = null
}
