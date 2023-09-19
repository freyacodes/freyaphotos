package dev.arbjerg.freyaphotos

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlin.io.path.Path
import kotlin.io.path.readText

val configData by lazy {
    Json.decodeFromString<Config>(Path("data/config.json").readText())
}

val runtimeConfig by lazy {
    RuntimeConfig(configData.collections.associate { col ->
        col.name to col.run {
            RuntimeCollection(
                col.title,
                col.icon,
                col.users.map {
                    configData.usersByName[it]!!.id.toString()
                }
            )
        }
    })
}

@Serializable
data class Config(
    val users: List<User>,
    val collections: List<CollectionConfig>
) {
    val usersByName = users.associateBy { it.name }
}

@Serializable
data class RuntimeConfig(
    val collections: Map<String, RuntimeCollection>
)

@Serializable
data class RuntimeCollection(
    val title: String,
    val icon: String,
    val users: List<String>
)

@Serializable
data class User(val id: Long, val name: String)

@Serializable
data class CollectionConfig(val name: String, val title: String, val users: List<String>, val icon: String)
