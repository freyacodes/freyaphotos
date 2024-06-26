import { Context } from "https://edge.netlify.com";
import { OAuth2Client } from "https://deno.land/x/oauth2_client@v1.0.2/mod.ts";
import jwtHelper from "../JwtHelper.ts";
import { DiscordUser } from "../types.d.ts";

interface Grant {
    bearer: string
    refresh: string
    expiry: number
}

export default async (request: Request, context: Context) => {
    const url = new URL(request.url);
    let jwt = context.cookies.get("token");

    if (url.searchParams.has("code")) {
        const grant = await resolveGrant(request);
        if (grant != null) {
            const user = await fetchDiscordUser(grant.bearer)
            jwt = await jwtHelper.createJwt({ ...grant, user })
            console.log("User has logged in", user)
            context.cookies.set({
                name: "token",
                value: jwt,
                expires: grant.expiry * 1000,
                secure: request.url.startsWith("https"),
                sameSite: "Lax"
            })
        }
    }

    return Response.redirect(new URL("/", request.url));
}

async function fetchDiscordUser(bearer: string): Promise<DiscordUser> {
    const response = await fetch("https://discord.com/api/users/@me", {
        headers: {
            "Authorization": "Bearer " + bearer
        }
    });
    if (response.status / 100 != 2) throw "Invalid status code: " + JSON.stringify(response);
    const body = await response.json();
    return {
        id: body.id,
        avatar: body.avatar,
        name: body.global_name
    }
}

async function resolveGrant(request: Request): Promise<Grant | null> {
    const redirectUri = new URL("/oauth2", request.url).toString();
    console.log(redirectUri)
    const oauth: OAuth2Client = new OAuth2Client({
        clientId: Deno.env.get("OAUTH_ID")!,
        clientSecret: Deno.env.get("OAUTH_SECRET")!,
        authorizationEndpointUri: "https://discord.com/api/oauth2/authorize",
        tokenUri: "https://discord.com/api/oauth2/token",
        redirectUri
    });
    const grant = await oauth.code.getToken(request.url);
    const scope = grant.scope;

    if (scope == null) return null;
    if (!scope.includes("identify")) throw "Invalid scope: " + scope

    return {
        bearer: grant.accessToken,
        refresh: grant.refreshToken!,
        expiry: grant.expiresIn! + Math.floor(+new Date() / 1000)
    }
}
