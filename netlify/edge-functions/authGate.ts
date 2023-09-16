import { Context } from "https://edge.netlify.com";
import jwtHelper from "../JwtHelper.ts"
import config from '../config.json' assert { type: "json" }

const galleryRegex = /\/gallery\/(\w+)/;
const galleryImageRegex = /\/img\/(\w+)\/.*/;

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

    if (groups1?.length != 2 && groups2?.length != 2) {
        console.log("Access denied: Unrecognised url")
        return denied;
    }

    let gallery: string
    if (groups1?.length == 2) {
        gallery = groups1[1]
    } else {
        gallery = groups2![1]
    }
    
    const access = (config.access as Record<string, string[]>);
    const allowedUsers = access[gallery];

    if (allowedUsers == null) {
        console.log("Unrecognised gallery: " + gallery)
        return denied;
    }

    const auth = await isAuthorised(jwt, allowedUsers);
    if (!auth) {
        console.log("Access denied: Not authenticated or not authorised")
        return denied;
    }
    return undefined;    
}

async function isAuthorised(jwt: string, allowedUsers: string[]): Promise<boolean> {
    let claims: Claims
    try {
        claims = await jwtHelper.validateJwt(jwt);
    } catch(e) {
        console.log("Authentication failed: ", e)
        return false;
    }
    
    if (allowedUsers == null) return false;
    return allowedUsers.includes(claims.user.id);
}
