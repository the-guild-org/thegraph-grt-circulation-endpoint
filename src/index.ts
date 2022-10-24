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
import { createErrorResponse, handleRequest } from "./utils/flow";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { getNewToken } from "./utils/getNewToken";
import { validateAndExtractTokenFromRequest } from "./utils/validate-and-extract-token-from-request";
import { createToken } from "./utils/createToken";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "POST" && request.url.endsWith("/get-new-token")) {
      return await getNewToken(request, env);
    }

    if (request.method === "POST" && request.url.endsWith("/create-token")) {
      return await createToken(request, env);
    }

    return await handleRequest(request, {
      jwtVerifySecret: env.JWT_VERIFY_SECRET,
    });
  },
};
