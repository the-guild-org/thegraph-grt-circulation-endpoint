import { Env } from "../env";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { validateAndExtractTokenFromRequest } from "./validate-and-extract-token-from-request";

export async function getNewToken(request: Request, env: Env) {
  const token = validateAndExtractTokenFromRequest(request);

  if (!token) {
    throw new Error(
      "No token provided. Please provide a token in the Authorization header."
    );
  }
  if (token) {
    const body = await request.json<{ months: number }>();
    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + body.months);
    const expirationTimestamp = Math.floor(expiration.getTime() / 1000);
    const token = await jwt.sign(
      { exp: expirationTimestamp },
      env.JWT_VERIFY_SECRET
    );
    return new Response(JSON.stringify({ token, expiration }));
  }
}
