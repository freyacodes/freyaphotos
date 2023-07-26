package dev.arbjerg.freyaphotos.build

import java.nio.file.Path
import java.util.concurrent.TimeUnit

object ImageMagick {

    fun createSmallThumbnail(inPath: Path, outPath: Path) {
        val command = "magick $inPath -verbose -delete 1 -gravity center -scale 400x400^ -extent 400x400 $outPath".split(" ")
        val proc = ProcessBuilder(command)
            .redirectError(ProcessBuilder.Redirect.INHERIT)
            .inheritIO()
            .start()

        proc.waitFor(20, TimeUnit.SECONDS)
        println("Wrote $outPath")
    }

}