/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import moment from "moment";
import { getBlockByTimestamp } from "./utils/get-all-blocks-info.graphql";
import { getGlobalStateByBlockNumber } from "./utils/get-all-global-states.graphql";
import { getLatestBlock } from "./utils/get-latest-block.graphql";
import { getLatestGlobalState } from "./utils/get-latest-global-states.graphql";

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
    try {
      // 1. Get the query params and extract the timestamp from it
      // request.url -> always valid -> new URL -> nothing to test
      const urlParams = new URL(request.url);
      // nothing to test
      const params = Object.fromEntries(urlParams.searchParams);
      // 1: should use timestamp from search params when it's provided
      // 2: should use current timestamp when search params is not provided
      // 3: should throw an error when timestamp is not a valid integer
      const todayTimestamp = moment().unix();
      // const defaultTimestamp = moment.unix(today.unix);
      const timestamp = params.timestamp
        ? parseInt(params.timestamp)
        : todayTimestamp;
      console.info(`Timestamp is: ${params.timestamp}`);
      console.info(`Timestamp is: ${timestamp}`);
      // 2. Convert the timestamp to block number
      const blockDetails = await getBlockByTimestamp(timestamp).then(
        (blockInfo) => {
          console.info(`blockInfo is: ${blockInfo}`);
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
        console.info(`blockInfo is: ${globalStateInfo}`);
        if (!globalStateInfo) {
          console.info(
            `globalStateInfo is: ${globalStateInfo} and globalStateInfo false`
          );

          return getLatestGlobalState();
        }

        return globalStateInfo;
      });
      // 3. Fetch the block state using the block number
      console.info(`Global State is: ${globalStateDetails}`);

      // 4. Return the block state
      return new Response(JSON.stringify({ globalStateDetails }));
    } catch (e) {
      console.error(e);
      return new Response(
        JSON.stringify({
          error: `Something went wrong, please call Tuval.`,
        }),
        {
          status: 500,
        }
      );
    }
  },
};
