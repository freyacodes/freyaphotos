import { Context } from "https://edge.netlify.com";
import jwtHelper from "./JwtHelper.ts"
import config from './config.json' assert { type: "json" } 
import gallery from "./gallery.ts";

const galleryRegex = //gallery/(\w+)/

export default async (request: Request, context: Context) => {
    const url = new URL(request.url);
    let jwt = context.cookies.get("token");

    if (jwt == null || await !isAuthorised(jwt, gallery)) {
        return new Response("Access denied", {
            status: 403
        });
    } else return undefined;

    
}

async function isAuthorised(jwt: string, gallery: string): Promise<boolean> {
    const claims = await jwtHelper.validateJwt(jwt)
    const allowedUsers = (config.access as Record<string, string[]>)
    if (allowedUsers == null) return false
    return claims.user.id in allowedUsers[gallery]
}
