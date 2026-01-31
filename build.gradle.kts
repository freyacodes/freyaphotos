import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
	kotlin("jvm") version "2.3.0"
	kotlin("plugin.serialization") version "2.3.0"
	application
}

group = "dev.arbjerg"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
	targetCompatibility = JavaVersion.VERSION_17
}


repositories {
	mavenCentral()
	maven("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
}

dependencies {
	implementation("org.jsoup:jsoup:1.16.1")
	implementation("com.github.mjeanroy:exiftool-lib:3.0.0")
	implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.1")
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}
application {
	mainClass.set("dev.arbjerg.freyaphotos.MainKt")
}

