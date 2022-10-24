import { Env } from "../env";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { validateAndExtractTokenFromRequest } from "./validate-and-extract-token-from-request";
import { createErrorResponse } from "./flow";

export async function getNewToken(
  request: Request,
  env: Env
): Promise<Response> {
  const currentToken = validateAndExtractTokenFromRequest(request);
  if (!currentToken) {
    return createErrorResponse("Missing Token", 400);
  }

  const isValid = await jwt.verify(currentToken, env.JWT_VERIFY_SECRET);
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
}
