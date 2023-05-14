package dev.arbjerg.freyaphotos.exif

import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Serializable
data class Metadata(
    val name: String,
    val make: String?,
    val model: String?,
    val lens: String?,

    var iso: Int?,
    var aperture: Float?,
    var shutterSpeed: Float?,
    var focalLength: Int?,
    var time: String?,

    var placesString: String?,
    var authorsString: String?
) {
    @Transient
    val parsedTime = time?.let {
        LocalDateTime.parse(it.take(19), dateFormat).atZone(ZoneId.of("Europe/Copenhagen"))
    }

    val country: String? = placesString?.split("|")?.getOrNull(1)
    val region: String? = placesString?.split("|")?.getOrNull(2)
    val city: String? = placesString?.split("|")?.getOrNull(3)
    val sublocation: String? = placesString?.split("|")?.getOrNull(4)

    val photographer: String? = authorsString?.split("|")?.getOrNull(1)
    val editor: String? = authorsString?.split("|")?.getOrNull(2)

    val prettyAperture: String? = aperture?.let { "f/$it" }
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
