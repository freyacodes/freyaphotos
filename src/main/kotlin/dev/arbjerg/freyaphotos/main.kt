package dev.arbjerg.freyaphotos

import dev.arbjerg.freyaphotos.build.Builder

fun main(args: Array<String>) {
    when(args.firstOrNull()) {
        "exif" -> Exif.compile()
        else -> Builder.build()
    }
}
