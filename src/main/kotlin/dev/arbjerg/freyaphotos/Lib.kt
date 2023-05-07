package dev.arbjerg.freyaphotos

import java.io.File

object Lib {
    val buildDir = File("site")
    val imageOutDir = buildDir.child("img")
    val imageThumbsOutDir = imageOutDir.child("thumbs")
    val publicImagesDir = File("data/public")
    val templateDir = File("templates")
    val templateBase = File("templates/base.html")
    val sassFile = templateDir.child("style").child("style.sass")
    val staticDir = File("static")
    val sidecarDir = File("/home/freya/photos")
}
