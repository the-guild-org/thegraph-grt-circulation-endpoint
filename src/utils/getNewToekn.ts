import { Env } from "../env";
import jwt from "@tsndr/cloudflare-worker-jwt";

export async function getNewToken(request: Request, env: Env) {
  const oldtoken = request.headers.get("oldtoken");

  if (oldtoken === env.JWT_VERIFY_SECRET) {
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
