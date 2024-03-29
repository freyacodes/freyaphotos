export type Claims = {
    bearer: string
    refresh: string
    expiry: number
    user: DiscordUser
}

export interface DiscordUser {
    id: string,
    name: string,
    avatar: string | null
}

export interface Collection {
    icon: string,
    title: string,
    users: Array<string>
}