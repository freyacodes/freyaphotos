package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.exif.Metadata
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable

@OptIn(ExperimentalSerializationApi::class)
@Serializable
class ManifestEntry(
    val meta: Metadata,
    val url: String
) {
    var previous: String? = null
    var next: String? = null
}
