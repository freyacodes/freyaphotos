package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Lib
import dev.arbjerg.freyaphotos.exif.Metadata
import kotlinx.serialization.EncodeDefault
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable

@OptIn(ExperimentalSerializationApi::class)
@Serializable
class ManifestEntry(
    val meta: Metadata
) {
    @EncodeDefault
    val url = Lib.getImagePath(meta.name)
    var previous: String? = null
    var next: String? = null
}
