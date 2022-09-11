/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { getAllBlocksInfo } from "./utils/get-all-blocks-info.graphql";
import { getAllGlobalStates } from "./utils/get-all-global-states.graphql";

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

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const urlParams = new URL(request.url);
    const params = Object.fromEntries(urlParams.searchParams);
    const blockNumber = await getAllBlocksInfo({
      timestamp_gte: params.timestamp,
    });
    const globalStates = await getAllGlobalStates({
      number: Number(blockNumber),
    });
    const globalStatesToJson = JSON.parse(globalStates);
    const globalStatesToJsonStringify = JSON.stringify(
      globalStatesToJson,
      null,
      2
    );
    console.info(globalStatesToJsonStringify);

    return new Response(globalStatesToJsonStringify);
  },
};
