export default {
    getAvatarUrl: function (user: DiscordUser) {
        if (user.avatar != null) {
            const image = Number(BigInt(user.id) >> 22n) % 6;
            return `https://cdn.discordapp.com/embed/avatars/${image}.png`;
        } else {
            return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png *`;
        }
    }
}