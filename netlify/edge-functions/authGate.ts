import { Context } from "https://edge.netlify.com";
import jwtHelper from "./JwtHelper.ts"
import config from './config.json' assert { type: "json" }

const galleryRegex = /\/gallery\/(\w+)/;

export default async (request: Request, context: Context) => {
    const denied = new Response("Access denied", {
        status: 403
    });

    const jwt = context.cookies.get("token");
    if (jwt == null) return denied;

    const url = new URL(request.url);
    const groups = url.pathname.match(galleryRegex);
    if (groups == null) return denied;
    
    const auth = await isAuthorised(jwt, groups[1]);
    if (!auth) return denied
    return undefined;    
}

async function isAuthorised(jwt: string, gallery: string): Promise<boolean> {
    const claims = await jwtHelper.validateJwt(jwt)
    const allowedUsers = (config.access as Record<string, string[]>)
    if (allowedUsers == null) return false
    return claims.user.id in allowedUsers[gallery]
}
