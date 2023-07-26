package dev.arbjerg.freyaphotos.build

import java.nio.file.Path
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.TimeUnit
import kotlin.io.path.deleteIfExists
import kotlin.system.exitProcess

object ImageMagick {

    val executors: ExecutorService = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors())
    val jobs = mutableListOf<Future<*>>()

    fun createSmallThumbnail(inPath: Path, outPath: Path) {
        val command = ("convert $inPath -delete 1 -gravity center " +
                "-scale 400x400^ -extent 400x400 $outPath").split(" ")
        submitCommand(command, outPath)
    }

    fun createLargeThumbnail(inPath: Path, outPath: Path) {
        val command = ("convert $inPath -delete 1 -resize 1000000@ $outPath").split(" ")
        submitCommand(command, outPath)
    }

    private fun submitCommand(command: List<String>, expectedPath: Path) {
        jobs.add(executors.submit {
            val proc = ProcessBuilder(command)
                .redirectError(ProcessBuilder.Redirect.INHERIT)
                .start()

            try {
                proc.waitFor(20, TimeUnit.SECONDS)
            } catch (e: InterruptedException) {
                expectedPath.deleteIfExists()
            }

            if (proc.exitValue() == 0) println("Wrote $expectedPath")
            else exitProcess(proc.exitValue())
        })
    }
}