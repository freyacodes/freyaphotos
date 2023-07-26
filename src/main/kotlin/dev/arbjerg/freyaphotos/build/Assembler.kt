package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Collection
import dev.arbjerg.freyaphotos.Lib
import dev.arbjerg.freyaphotos.readHtml
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.util.concurrent.TimeUnit
import kotlin.io.path.name
import kotlin.io.path.pathString
import kotlin.io.path.readText
import kotlin.io.path.writeText
import kotlin.system.exitProcess

object Assembler {

    private val sass: String by lazy {
        val proc = ProcessBuilder("node_modules/.bin/sass", Lib.sassFile.pathString)
            .redirectError(ProcessBuilder.Redirect.INHERIT)
            .start()

        proc.waitFor(20, TimeUnit.SECONDS)
        if (proc.exitValue() != 0) exitProcess(proc.exitValue())


        if (proc.exitValue() != 0) {
            if (Lib.isNetlify) exitProcess(-1)
        } else println("Parsed sass")
        proc.inputStream.bufferedReader().readText()
    }

    fun buildCollection(collection: Collection) {
        val images = collection.images

        val doc = Lib.templateBase.readHtml()
        doc.getElementById("style")!!.text(sass)

        val manifestEntries = images.map { ManifestEntry(it.metadata, it.largeThumbWebPath) }
        manifestEntries.forEachIndexed { index, manifestEntry ->
            manifestEntry.previous = manifestEntries.getOrNull(index - 1)?.meta?.name
            manifestEntry.next = manifestEntries.getOrNull(index + 1)?.meta?.name
        }

        val manifest = Json.encodeToString(manifestEntries.associateBy { it.meta.name })
        val script = "const manifest = $manifest;\n\n${Lib.galleryScriptFile.readText()}"

        val gallery = Lib.templateDir.resolve("gallery/gallery.html").readHtml()
        val cardTemplate = Lib.templateDir.resolve( "gallery/card.html")
            .readHtml()
            .getElementsByTag("body")
            .single()
            .firstElementChild()!!

        images.forEach { image ->
            val card = cardTemplate.clone()
            card.attr("href", image.originalWebPath)
            card.attr("name", image.metadata.name)
            card.getElementsByClass("metadata").html("<p>${image.outputPath.name}</p>")
            card.getElementsByClass("thumbnail")
                .attr("style", "background-image: url(${image.smallThumbWebPath})")
            gallery.getElementById("gallery-cards")!!.appendChild(card)
        }

        doc.getElementById("content")!!.appendChild(gallery.firstElementChild()!!)
        doc.getElementById("script")!!.text(script)
        doc.getElementById("gallery-title")!!.text(collection.title)
        collection.htmlOutPath.writeText(doc.toString())
        println("Wrote ${collection.htmlOutPath}, ${images.size} images")
    }
}
