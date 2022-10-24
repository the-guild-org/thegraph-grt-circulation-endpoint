import { Env } from "../env";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { createErrorResponse } from "./flow";

export async function createToken(
  request: Request,
  env: Env
): Promise<Response> {
  const passwordHeader = request.headers.get("password");

  if (passwordHeader === env.TOKEN_CREATION_PASSWORD) {
    const body = await request.json<{ months: number }>();
    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + body.months);
    const expirationTimestamp = Math.floor(expiration.getTime() / 1000);
    const token = await jwt.sign(
      { exp: expirationTimestamp },
      env.JWT_VERIFY_SECRET
    );

    return new Response(JSON.stringify({ token, expiration }));
  } else {
    return createErrorResponse("Unauthorized", 403);
  }
}
