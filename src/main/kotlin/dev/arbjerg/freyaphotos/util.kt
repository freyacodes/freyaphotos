package dev.arbjerg.freyaphotos

import org.jsoup.Jsoup
import java.io.File

fun File.child(name: String) = File(this, name)
fun File.readHtml() = Jsoup.parse(this)