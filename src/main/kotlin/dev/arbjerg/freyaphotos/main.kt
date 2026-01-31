package dev.arbjerg.freyaphotos

import dev.arbjerg.freyaphotos.build.Builder
import dev.arbjerg.freyaphotos.exif.Exif

fun main(args: Array<String>) {
    println("Args: $args")

    when(args.firstOrNull()) {
        "exif" -> Exif.compile()
        null -> Builder.build()
        else -> error("Unexpected args: $args")
    }
}
