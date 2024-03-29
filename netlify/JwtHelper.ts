import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts';
import { Claims } from './types.d.ts';

const hmacSecret = new TextEncoder().encode(Deno.env.get("JWT_SECRET"))
const jwtAlg = "HS256"
const jwtIssuer = "freyaphotos"

export default {
    createJwt: async function(claims: Claims): Promise<string> {
        return await new jose.SignJWT(claims)
            .setProtectedHeader({ alg: jwtAlg })
            .setIssuedAt()
            .setIssuer(jwtIssuer)
            .setExpirationTime(claims.expiry)
            .sign(hmacSecret)
    },

    validateJwt: async function(jwt: string): Promise<Claims> {
        const result = await jose.jwtVerify(jwt, hmacSecret, {
            issuer: "freyaphotos"
        });
        return result.payload as Claims
    } 
}