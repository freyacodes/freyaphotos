package dev.arbjerg.freyaphotos.exif

import kotlinx.serialization.EncodeDefault
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Serializable
@OptIn(ExperimentalSerializationApi::class)
data class Metadata(
    val name: String,
    val make: String? = null,
    val model: String? = null,
    val lens: String? = null,

    var iso: Int? = null,
    var aperture: Float? = null,
    var shutterSpeed: Float? = null,
    var focalLength: Int? = null,
    var time: String? = null,

    var placesString: String? = null,
    var authorsString: String? = null
) {
    @Transient
    val parsedTime = time?.let {
        LocalDateTime.parse(it.take(19), dateFormat).atZone(ZoneId.of("Europe/Copenhagen"))
    }

    @EncodeDefault
    val country: String? = placesString?.split("|")?.getOrNull(1)
    @EncodeDefault
    val region: String? = placesString?.split("|")?.getOrNull(2)
    @EncodeDefault
    val city: String? = placesString?.split("|")?.getOrNull(3)
    @EncodeDefault
    val sublocation: String? = placesString?.split("|")?.getOrNull(4)

    @EncodeDefault
    val photographer: String? = authorsString?.split("|")?.getOrNull(1)
    @EncodeDefault
    val editor: String? = authorsString?.split("|")?.getOrNull(2)

    @EncodeDefault
    val prettyAperture: String? = aperture?.let { "f/$it" }
    @EncodeDefault
    val prettyCamera: String? = model?.let {
        buildString {
            if (make != null) append("$make ")
            when (model) {
                "ILCE-7M2" -> append("A7 II")
                "ILCE-7M3" -> append("A7 III")
                else -> append(model)
            }
        }
    }

    companion object {
        private val dateFormat = DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm:ss")!!
    }
}
