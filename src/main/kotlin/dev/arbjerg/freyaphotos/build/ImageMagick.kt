package dev.arbjerg.freyaphotos.build

import java.nio.file.Path
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.TimeUnit
import kotlin.io.path.deleteIfExists

object ImageMagick {

    val executors = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors())
    val jobs = mutableListOf<Future<*>>()

    fun createSmallThumbnail(inPath: Path, outPath: Path) {
        val command = ("convert $inPath -verbose -delete 1 -gravity center " +
                "-scale 400x400^ -extent 400x400 $outPath").split(" ")
        jobs.add(executors.submit {

            val proc = ProcessBuilder(command)
                .redirectError(ProcessBuilder.Redirect.INHERIT)
                .start()

            try {
                proc.waitFor(20, TimeUnit.SECONDS)
            } catch (e: InterruptedException) {
                outPath.deleteIfExists()
            }

            println("Wrote $outPath")
        })
    }
}