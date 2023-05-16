package dev.arbjerg.freyaphotos

import java.io.File

object Lib {
    val isNetlify = System.getenv("NETLIFY") == "true"
    val buildDir = File("site")
    val imageOutDir = buildDir.child("img")
    val publicImagesDir = File("images/public")
    val templateDir = File("templates")
    val templateBase = File("templates/base.html")
    val sassFile = templateDir.child("style").child("style.sass")
    val staticDir = File("static")
    val sidecarDir = File("/home/freya/photos")
    val metaDir = File("meta")

    fun getImagePath(name: String, thumbnail: Boolean = false) = when {
        isNetlify && !thumbnail -> "/images/public/$name.jpg"
        isNetlify -> "/images/public/$name.jpg?nf_resize=smartcrop&w=400&h=400"
        else -> "/img/$name.jpg"
    }
}
