/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { getBlockNumberByTimestamp } from "./utils/get-all-blocks-info.graphql";
import { getGlobalStateByBlockNumber } from "./utils/get-all-global-states.graphql";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

type Something = {
  id: string;
  boop: string;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // 1. Get the query params and extract the timestamp from it
    const urlParams = new URL(request.url);
    const params = Object.fromEntries(urlParams.searchParams);
    const timestamp = params.timestamp
      ? parseInt(params.timestamp)
      : Date.now();
    // 2. Convert the timestamp to block number
    const blockNumber = await getBlockNumberByTimestamp(timestamp);
    // 3. Fetch the block state using the block number
    const globalState = await getGlobalStateByBlockNumber(blockNumber);
    // 4. Return the block state
    return new Response(JSON.stringify(globalState));
  },
};
