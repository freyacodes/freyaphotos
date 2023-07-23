package dev.arbjerg.freyaphotos

import java.io.File

object Lib {
    val isNetlify = System.getenv("NETLIFY") == "true"
    val buildDir = File("site")
    val imageOutDir = buildDir.child("img")
    val thumbsOutDir = imageOutDir.child("thumbs")
    val publicImagesDir = imageOutDir
    val templateDir = File("templates")
    val templateBase = File("templates/base.html")
    val galleryScriptFile = templateDir.child("gallery.js")
    val sassFile = templateDir.child("style").child("style.sass")
    val staticDir = File("static")
    val sidecarDir = File("/home/freya/photos")
    val metaDir = File("meta")

    fun getImagePath(name: String, thumbnail: Boolean = false) = when {
        !thumbnail -> "/img/$name.jpg"
        else -> "/img/$name.jpg?nf_resize=smartcrop&w=400&h=400"
    }
}
