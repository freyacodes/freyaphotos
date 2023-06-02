package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.Lib
import dev.arbjerg.freyaphotos.child
import dev.arbjerg.freyaphotos.readHtml
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.util.concurrent.TimeUnit
import kotlin.system.exitProcess

object Assembler {

    private val sass: String by lazy {
        val proc = ProcessBuilder("node_modules/.bin/sass", Lib.sassFile.path)
            .redirectError(ProcessBuilder.Redirect.INHERIT)
            .start()

        proc.waitFor(20, TimeUnit.SECONDS)


        if (proc.exitValue() != 0) {
            if (Lib.isNetlify) exitProcess(-1)
        } else println("Parsed sass")
        proc.inputStream.bufferedReader().readText()
    }

    fun buildCollection(name: String, images: List<Image>) {
        val doc = Lib.templateBase.readHtml()
        doc.getElementById("style")!!.text(sass)

        val manifestEntries = images.map { ManifestEntry(it.metadata) }
        manifestEntries.forEachIndexed { index, manifestEntry ->
            manifestEntry.previous = manifestEntries.getOrNull(index - 1)?.meta?.name
            manifestEntry.next = manifestEntries.getOrNull(index + 1)?.meta?.name
        }

        val manifest = Json.encodeToString(manifestEntries.associateBy { it.meta.name })
        val script = "const manifest = $manifest;\n\n${Lib.galleryScriptFile.readText()}"

        val gallery = File(Lib.templateDir, "gallery/gallery.html").readHtml()
        val cardTemplate = File(Lib.templateDir, "gallery/card.html")
            .readHtml()
            .getElementsByTag("body")
            .single()
            .firstElementChild()!!

        images.forEach { image ->
            val card = cardTemplate.clone()
            card.attr("href", "/img/${image.file.name}")
            card.attr("name", image.metadata.name)
            card.getElementsByClass("metadata").html("<p>${image.file.name}</p>")
            card.getElementsByClass("thumbnail")
                .attr("style", "background-image: url(${Lib.getImagePath(image.file.nameWithoutExtension, thumbnail = true)})")
            gallery.getElementById("gallery-cards")!!.appendChild(card)
        }

        doc.getElementById("content")!!.appendChild(gallery.firstElementChild()!!)
        doc.getElementById("script")!!.text(script)
        Lib.buildDir.child("index.html").writeText(doc.toString())
        println("Wrote index.html")
    }
}
