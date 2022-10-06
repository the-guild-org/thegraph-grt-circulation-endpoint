/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import jwt from "@tsndr/cloudflare-worker-jwt";
import {
  getBlockByTimestamp,
  getLatestBlock,
} from "./utils/blocks-info.graphql";
import {
  getGlobalStateByBlockNumber,
  getLatestGlobalState,
} from "./utils/global-states.graphql";
import { validateAndExtractTokenFromRequest } from "./utils/validate-and-extract-token-from-request";

export interface Env {
  JWT_VERIFY_SECRET: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const urlParams = new URL(request.url);
    const params = Object.fromEntries(urlParams.searchParams);

    const token = validateAndExtractTokenFromRequest(request);
    if (!token) {
      return new Response("Missing Token", {
        status: 403,
      });
    }

    const isValid = await jwt.verify(token, env.JWT_VERIFY_SECRET);
    console.info(
      `Authorization was trying to verify. The Authorization State: ${isValid}`
    );
    if (!isValid) {
      return new Response("Unauthorized", {
        status: 403,
      });
    }

    const todayTimestamp = Math.floor(Date.now() / 1000);
    const timestamp = params.timestamp
      ? parseInt(params.timestamp)
      : todayTimestamp;

    console.info(
      `Params timestamp is: ${params.timestamp}, Timestamp for blockDetails: ${timestamp}`
    );

    const blockDetails = await getBlockByTimestamp(timestamp).then(
      (blockInfo) => {
        console.info(`blockDetails - blockInfo is: ${blockInfo}`);
        if (!blockInfo) {
          return getLatestBlock();
        }

        return blockInfo;
      }
    );

    console.info(`blockDetails is: ${blockDetails}`);

    const globalStateDetails = await getGlobalStateByBlockNumber(
      blockDetails
    ).then((globalStateInfo) => {
      console.info(`globalStateDetails - blockInfo is: ${globalStateInfo}`);
      if (globalStateInfo == null) {
        console.info(`globalStateInfo is missing: ${globalStateInfo}`);

        return getLatestGlobalState();
      }

      return globalStateInfo;
    });
    console.info(`Global State is: ${globalStateDetails}`);

    return new Response(JSON.stringify({ globalStateDetails }));
  },
};
