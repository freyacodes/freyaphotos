package dev.arbjerg.freyaphotos.exif

import com.thebuzzmedia.exiftool.ExifTool
import com.thebuzzmedia.exiftool.ExifToolBuilder
import com.thebuzzmedia.exiftool.Tag
import com.thebuzzmedia.exiftool.core.UnspecifiedTag
import dev.arbjerg.freyaphotos.Collection
import dev.arbjerg.freyaphotos.Lib
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.nio.file.Files
import java.nio.file.Path
import kotlin.io.path.*

object Exif {

    private const val sidecarExtension = ".arw.xmp"

    @OptIn(ExperimentalPathApi::class)
    fun compile() {
        Lib.inputImagesDir.walk()
            .filter { it.name.endsWith(".JPG") }
            .forEach { Files.move(it, it.parent.resolve(it.nameWithoutExtension + ".jpg")) }

        val exifTool: ExifTool = ExifToolBuilder().build()
        val sidecars = mutableMapOf<String, Path>()
        Lib.sidecarDir.walk().forEach {
            if (!it.name.lowercase().endsWith(sidecarExtension)) return@forEach
            sidecars[it.name.dropLast(sidecarExtension.length).lowercase()] = it
        }

        Lib.metaDir.createDirectories()
        val json = Json { prettyPrint = true }

        val collections = Collection.resolve()

        collections.flatMap { it.images }.forEach { image ->
            val file = image.inputPath
            val name = image.inputPath.nameWithoutExtension
            println("Reading $file")
            var meta = buildMetadata(name, exifTool.getImageMeta(file.toFile()), isSidecar = false)
            val sidecar = sidecars[name.lowercase()]
            val sidecarMeta = sidecar?.let {
                println("Reading $it")
                buildMetadata(name, exifTool.getImageMeta(it.toFile()), isSidecar = true)
            }
            meta = if (sidecarMeta == null) meta else mergeMetadata(meta, sidecarMeta)

            val metaFile = Lib.metaDir.resolve("$name.json")
            metaFile.writeText(json.encodeToString(meta))
            println("Wrote $metaFile")
        }
    }

    private fun buildMetadata(name: String, tags: Map<Tag, String>, isSidecar: Boolean): Metadata {
        val t = tags.mapKeys { it.key.name }
        val subjects = tags.subjects
        return Metadata(
            name,

            t["Make"],
            t["Model"],
            t["LensModel"],

            t["ISO"]?.toInt(),
            t["Aperture"]?.toFloat(),
            t["ShutterSpeed"]?.toFloat(),
            t["FocalLength"]?.toFloat(),
            t["DateTimeOriginal"],

            t["ImageWidth"]?.toInt(),
            t["ImageHeight"]?.toInt(),

            subjects.find { it.startsWith("places") },
            authorsString = subjects.find { it.startsWith("authors") }
        )
    }

    private fun mergeMetadata(image: Metadata, sidecar: Metadata) = image.copy(
        name = image.name,

        make = image.make ?: sidecar.make,
        model = image.model ?: sidecar.model,
        lens = image.lens ?: sidecar.lens,

        iso = image.iso ?: sidecar.iso,
        aperture = image.aperture ?: sidecar.aperture,
        shutterSpeed = image.shutterSpeed ?: sidecar.shutterSpeed,
        focalLength = image.focalLength ?: sidecar.focalLength,
        timestamp = image.timestamp ?: sidecar.timestamp,

        placesString = sidecar.placesString ?: image.placesString,
        authorsString = sidecar.authorsString ?: image.authorsString,
    )

    private val Map<Tag, String>.subjects
        get() = this[UnspecifiedTag("HierarchicalSubject")]
            ?.split("|>☃")
            ?: emptyList()
}