import { Context } from "https://edge.netlify.com";
import jwtHelper from "../JwtHelper.ts"
import config from '../config.json' assert { type: "json" }

const galleryRegex = /\/gallery\/(\w+)/;
const galleryImageRegex = /\/img\/(\w+).*/;

export default async (request: Request, context: Context) => {
    const denied = new Response("Access denied", {
        status: 403
    });

    const jwt = context.cookies.get("token");
    if (jwt == null) {
        console.log("Access denied: missing token")
        return denied;
    }

    const url = new URL(request.url);
    const groups1 = url.pathname.match(galleryRegex);
    const groups2 = url.pathname.match(galleryImageRegex);
    if (groups1 == null && groups2 == null) {
        console.log("Access denied: Unrecognised url")
        return denied;
    }

    const gallery = groups1 != null ? groups1[1] : groups2![2]
    
    const auth = await isAuthorised(jwt, gallery);
    if (!auth) {
        console.log("Access denied: Not authenticated or not authorised")
        return denied;
    }
    return undefined;    
}

async function isAuthorised(jwt: string, gallery: string): Promise<boolean> {
    const claims = await jwtHelper.validateJwt(jwt)
    const allowedUsers = (config.access as Record<string, string[]>)
    if (allowedUsers == null) return false
    return claims.user.id in allowedUsers[gallery]
}
