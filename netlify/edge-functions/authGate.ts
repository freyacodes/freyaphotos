import { Context } from "https://edge.netlify.com";
import jwtHelper from "../JwtHelper.ts"
import config from '../config.json' with { type: "json" }
import { Claims, Collection } from "../types.d.ts";

const galleryRegex = /\/gallery\/(\w+)/;
const galleryImageRegex = /\/img\/(\w+)\/.*/;
const galleryManifestRegex = /\/manifests\/(\w+)\/.*/;
const galleryRegexes = [galleryRegex, galleryImageRegex, galleryManifestRegex];

export default async (request: Request, context: Context) => {
    const denied = new Response("Access denied", {
        status: 403
    });

    const jwt = context.cookies.get("token");
    if (jwt == null) {
        console.log("Access denied: missing token", request.url)
        return denied;
    }

    const gallery = getGalleryName(new URL(request.url));

    if (gallery == null) {
        console.log("Access denied: Unrecognised url")
        return denied;
    } else if (gallery == "public") {
        return undefined;
    }

    const collections = config.collections as Record<string, Collection>;
    const collection = collections[gallery];

    if (collection == null) {
        console.log("Unrecognised gallery: " + gallery)
        return denied;
    }

    const auth = await isAuthorised(jwt, collection.users);
    if (!auth) {
        console.log("Access denied: Not authenticated or not authorised")
        return denied;
    }
    return undefined;
}

function getGalleryName(url: URL): string | null {
    for (const regex in galleryRegexes) {
        const groups = url.pathname.match(regex);
        if (groups?.length == 2) return groups[1];
    }
    return null
}

async function isAuthorised(jwt: string, allowedUsers: string[]): Promise<boolean> {
    let claims: Claims
    try {
        claims = await jwtHelper.validateJwt(jwt);
    } catch (e) {
        console.log("Authentication failed: ", e)
        return false;
    }

    if (allowedUsers == null) return false;
    return allowedUsers.includes(claims.user.id);
}
