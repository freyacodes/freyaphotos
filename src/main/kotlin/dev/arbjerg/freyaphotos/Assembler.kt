package dev.arbjerg.freyaphotos

import java.io.File
import java.util.concurrent.TimeUnit
import kotlin.system.exitProcess

object Assembler {

    private val sass: String by lazy {
        val proc = ProcessBuilder("node_modules/.bin/sass", Lib.sassFile.path)
            .redirectError(ProcessBuilder.Redirect.INHERIT)
            .start()

        proc.waitFor(20, TimeUnit.SECONDS)

        if (proc.exitValue() != 0) exitProcess(-1)
        println("Parsed sass")
        proc.inputStream.bufferedReader().readText()
    }

    fun buildCollection(name: String, images: List<File>) {
        val doc = Lib.templateBase.readHtml()
        doc.getElementById("style")!!.text(sass)

        val gallery = File(Lib.templateDir, "gallery/gallery.html").readHtml()
        val cardTemplate = File(Lib.templateDir, "gallery/card.html")
            .readHtml()
            .getElementsByTag("body")
            .single()
            .firstElementChild()!!

        images.forEach { image ->
            val card = cardTemplate.clone()
            card.attr("href", "/img/${image.name}")
            card.getElementsByClass("metadata").html("<p>${image.name}</p>")
            card.getElementsByClass("thumbnail")
                .attr("style", "background-image: url(/img/thumbs/${image.name})")
            gallery.getElementById("gallery-cards")!!.appendChild(card)
        }

        doc.getElementById("content")!!.appendChild(gallery.firstElementChild()!!)
        Lib.buildDir.child("index.html").writeText(doc.toString())
        println("Wrote index.html")
    }
}
