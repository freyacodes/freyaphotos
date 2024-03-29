import { Context } from "https://edge.netlify.com";
import { DOMParser } from "https://esm.sh/linkedom@0.15.3";
import JwtHelper from "../JwtHelper.ts";
import DiscordHelper from "../DiscordHelper.ts";
import config from '../config.json' with { type: "json" }
import Vectors from "../Vectors.ts";
import { Collection } from "../types.d.ts";

const collections = config.collections as Record<string, Collection>

export default async (request: Request, context: Context) => {
    const token = context.cookies.get("token");
    if (token == null) return;

    let claims;
    try {
        claims = await JwtHelper.validateJwt(token);
    } catch (error) {
        console.log("Resetting token because of error: " + error);
        context.cookies.delete("token");
        return undefined;
    }

    const response = await context.next();
    const document = new DOMParser().parseFromString(await response.text(), "text/html")

    document.getElementById("avatar-placeholder").setAttribute("class", "hidden");
    const avatar = document.getElementById("avatar");
    avatar.removeAttribute("class");
    avatar.setAttribute("src", DiscordHelper.getAvatarUrl(claims.user));

    const publicNavbutton = document.getElementById("public-navbutton");
    if (new URL(request.url).pathname == "/") {
        publicNavbutton.setAttribute("class", "navbutton selected")
    }

    for (const [name, collection] of Object.entries(collections)) {
        if (!collection.users.includes(claims.user.id)) continue;
        const newButton = document.createElement("a");
        newButton.setAttribute("class", request.url.endsWith(name) ? "navbutton selected" : "navbutton");
        newButton.setAttribute("title", collection.title);
        newButton.setAttribute("href", "/gallery/" + name);
        newButton.innerHTML = Vectors[collection.icon]

        publicNavbutton.insertAdjacentElement("afterend", newButton)
    }

    return new Response(document.toString(), response);
}
