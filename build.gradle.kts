import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	kotlin("jvm") version "1.7.22"
}

group = "dev.arbjerg"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_1_8
	targetCompatibility = JavaVersion.VERSION_1_8
}


repositories {
	mavenCentral()
	maven("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
}

dependencies {
	implementation("org.jsoup:jsoup:1.16.1")
	implementation("com.github.mjeanroy:exiftool-lib:3.0.0")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
