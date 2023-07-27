package dev.arbjerg.freyaphotos

import org.jsoup.Jsoup
import java.nio.file.Path
import kotlin.io.path.listDirectoryEntries

fun Path.readHtml() = Jsoup.parse(this.toFile())
fun Path.list() = listDirectoryEntries()