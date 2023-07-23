import { OAuth2Client } from "https://deno.land/x/oauth2_client@v1.0.2/mod.ts";
import { Context } from "https://edge.netlify.com";
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts';

const hmacSecret = new TextEncoder().encode(Netlify.env.get("JWT_SECRET"))
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
    userId: string
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
            const userId = "123"
            jwt = await createJwt({ ...grant, userId })
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

async function resolveGrant(request: Request, context: Context): Promise<Grant | null> {
    const oauth: OAuth2Client = new OAuth2Client({
        clientId: Netlify.env.get("OAUTH_ID")!,
        clientSecret: Netlify.env.get("OAUTH_SECRET")!,
        authorizationEndpointUri: "https://discord.com/api/oauth2/authorize",
        tokenUri: "https://discord.com/api/oauth2/token",
        redirectUri: context.site.url
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

