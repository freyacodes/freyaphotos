import { Context } from "https://edge.netlify.com";
import { DOMParser } from "https://esm.sh/linkedom@0.15.3";
import JwtHelper from "../JwtHelper.ts";
import DiscordHelper from "../DiscordHelper.ts";

export default async (_request: Request, context: Context) => {
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

    console.log("Debug", avatar, document, document.toString())

    return new Response(document.toString(), response);
}
