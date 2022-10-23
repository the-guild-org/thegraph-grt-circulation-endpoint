import { Env } from "../env";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { validateAndExtractTokenFromRequest } from "./validate-and-extract-token-from-request";
import { createErrorResponse } from "./flow";

// input: Authorization: Bearer CURRENT_TOKEN
export async function getNewToken(
  tokenInput: string,
  request: Request,
  env: Env,
  jwtVerifySecret: string
): Promise<Response> {
  const isValid = await jwt.verify(tokenInput, jwtVerifySecret);

  if (!isValid) {
    return createErrorResponse("Unauthorized", 403);
  }

  const body = await request.json<{ months: number }>();
  const expiration = new Date();
  expiration.setMonth(expiration.getMonth() + body.months);
  const expirationTimestamp = Math.floor(expiration.getTime() / 1000);
  const token = await jwt.sign(
    { exp: expirationTimestamp },
    env.JWT_VERIFY_SECRET
  );

  return new Response(JSON.stringify({ token, expiration }));

  // return output: { "token": "...", "expiration": "..." }
}
