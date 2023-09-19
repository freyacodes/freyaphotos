type Claims = {
    bearer: string
    refresh: string
    expiry: number
    user: DiscordUser
}

interface DiscordUser {
    id: string,
    name: string,
    avatar: string | null
}

interface Collection {
    users: Array<string>
}