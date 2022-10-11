/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Env } from "./env";
import { handleRequest } from "./utils/flow";
import jwt from "@tsndr/cloudflare-worker-jwt";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "POST" && request.url.endsWith("/create-token")) {
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
      }
    }

    return await handleRequest(request, {
      jwtVerifySecret: env.JWT_VERIFY_SECRET,
    });
  },
};
