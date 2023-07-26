package dev.arbjerg.freyaphotos

import kotlin.io.path.Path

object Lib {
    val isNetlify = System.getenv("NETLIFY") == "true"
    val buildDir = Path("site")
    val galleryDir = Path("site/gallery")
    val imageOutDir = Path("site/img")
    val inputImagesDir = Path("data/img")
    val metaDir = Path("data/meta")
    val templateDir = Path("templates")
    val templateBase = Path("templates/base.html")
    val galleryScriptFile = Path("templates/gallery.js")
    val sassFile = Path("templates/style/style.sass")
    val staticDir = Path("static")
    val sidecarDir = Path("/home/freya/photos")
}
