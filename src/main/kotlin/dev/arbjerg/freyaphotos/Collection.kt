package dev.arbjerg.freyaphotos

import dev.arbjerg.freyaphotos.build.Image
import dev.arbjerg.freyaphotos.exif.Metadata
import kotlinx.serialization.json.Json
import java.nio.file.Path
import kotlin.io.path.*

data class Collection(
    val name: String,
    val images: List<Image>,
    val config: CollectionConfig
) {
    val htmlOutPath: Path = if (name == "public") {
        Lib.buildDir.resolve("index.html")
    } else {
        Lib.galleryDir.resolve("$name.html")
    }

    val imageOutPath: Path = Lib.imageOutDir.resolve(name)
    val manifestOutPath: Path = Lib.manifestOutDir.resolve("$name.js")

    companion object {
        fun resolve(skipMeta: Boolean = false): List<Collection> = Lib.inputImagesDir.list()
            .map { dir ->
                val imageList = mutableListOf<Image>()
                val config = configData.collections.first { it.name == dir.name }
                val collection = Collection(dir.name, imageList, config)

                dir.list().mapTo(imageList) {
                    if (it.extension != "jpg") error("File extension must be jpg: $it")
                    val outputPath = collection.imageOutPath.resolve(it.name)

                    val metaFile = Lib.metaDir.resolve(it.nameWithoutExtension + ".json")
                    val meta: Metadata = if (metaFile.exists() && !skipMeta) {
                        Json.decodeFromString(metaFile.readText())
                    } else {
                        Metadata(it.nameWithoutExtension)
                    }

                    Image(it, outputPath, meta, collection)
                }.run {
                    if (skipMeta) return@run this
                    sortByDescending {
                        it.metadata.zoneDateTime!!
                    }
                }

                collection
            }
    }
}