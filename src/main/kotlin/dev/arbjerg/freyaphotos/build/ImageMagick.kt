package dev.arbjerg.freyaphotos.build

import dev.arbjerg.freyaphotos.exif.Metadata
import java.nio.file.Path
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.TimeUnit
import kotlin.io.path.deleteIfExists
import kotlin.math.min
import kotlin.system.exitProcess

object ImageMagick {

    val executors: ExecutorService = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors())
    val jobs = mutableListOf<Future<*>>()
    private const val smallLength = 400
    private const val cropLength = 500
    private const val smallDimension = "${smallLength}x$smallLength"

    fun createSmallThumbnail(inPath: Path, outPath: Path, metadata: Metadata) {
        val command = if (metadata.faceHint != null) {
            val (faceX, faceY) = metadata.faceHint!!
            val resX = metadata.resolutionX!!
            val resY = metadata.resolutionY!!
            val shortestSide = min(resX, resY)
            val cropX = (faceX - shortestSide / 2).coerceIn(0..(resX - shortestSide))
            val cropY = (faceY - shortestSide / 2).coerceIn(0..(resY - shortestSide))

            "convert $inPath -delete 1 -auto-orient -extent ${shortestSide}x$shortestSide!+${cropX}+${cropY}" +
                    " -scale 400x400! $outPath"

        } else {
            "convert $inPath -delete 1 -auto-orient -gravity center " +
                    "-scale ${smallDimension}^ -extent $smallDimension $outPath"
        }
        submitCommand(command.split(" "), outPath)
    }

    fun createLargeThumbnail(inPath: Path, outPath: Path) {
        val command = ("convert $inPath -delete 1 -auto-orient -resize 1000000@ $outPath").split(" ")
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