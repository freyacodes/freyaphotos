import { OAuth2Client } from "https://deno.land/x/oauth2_client@v1.0.2/mod.ts";
import { Context } from "https://edge.netlify.com";
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts';

const hmacSecret = new TextEncoder().encode(Deno.env.get("JWT_SECRET"))
const jwtAlg = "HS256"
const jwtIssuer = "freyaphotos"

interface Grant {
    bearer: string
    refresh: string
    expiry: number
}

type Claims = {
    bearer: string
    refresh: string
    expiry: number
    user: DiscordUser
}

interface DiscordUser {
    id: string,
    name: string,
    avatar: string
}

//const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret, {
//    issuer: "freyaphotos"
//})

export default async (request: Request, context: Context) => {
    const url = new URL(request.url);
    let jwt = context.cookies.get("token");

    if (url.searchParams.has("code")) {
        const grant = await resolveGrant(request, context);
        if (grant != null) {
            const user = await fetchDiscordUser(grant.bearer)
            jwt = await createJwt({ ...grant, user })
            context.cookies.set({
                name: "token",
                value: jwt,
                expires: grant.expiry * 1000,
                secure: true,
                sameSite: "Strict"
            })
        }
    }

    return;
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

async function resolveGrant(request: Request, context: Context): Promise<Grant | null> {
    const oauth: OAuth2Client = new OAuth2Client({
        clientId: Deno.env.get("OAUTH_ID")!,
        clientSecret: Deno.env.get("OAUTH_SECRET")!,
        authorizationEndpointUri: "https://discord.com/api/oauth2/authorize",
        tokenUri: "https://discord.com/api/oauth2/token",
        redirectUri: context.site.url + "/"
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

async function createJwt(claims: Claims): Promise<string> {
    return await new jose.SignJWT(claims)
        .setProtectedHeader({ alg: jwtAlg })
        .setIssuedAt()
        .setIssuer(jwtIssuer)
        .setExpirationTime(claims.expiry)
        .sign(hmacSecret)
}
