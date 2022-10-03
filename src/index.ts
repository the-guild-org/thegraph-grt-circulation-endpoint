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
import moment from "moment";
import { getBlockByTimestamp } from "./utils/get-block-by-timestamp.graphql";
import { getGlobalStateByBlockNumber } from "./utils/get-global-state-by-block-number";
import { getLatestBlock } from "./utils/get-latest-block.graphql";
import { getLatestGlobalState } from "./utils/get-latest-global-states.graphql";

export interface Env {}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const urlParams = new URL(request.url);
    const params = Object.fromEntries(urlParams.searchParams);

    const isValid = await jwt.verify(
      // @ts-ignore: Object is possibly 'null'.
      request.headers.get("Authorization").split(" ")[1],
      "secret"
    );
    console.info({ isValid });

    if (isValid) {
      
      const todayTimestamp = moment().unix();
      const timestamp = params.timestamp
        ? parseInt(params.timestamp)
        : todayTimestamp;

      console.info(`Params timestamp is: ${params.timestamp}`);
      console.info(`Timestamp for blockDetails: ${timestamp}`);

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
        if (!globalStateInfo) {
          console.info(
            `globalStateInfo is: ${globalStateInfo} and globalStateInfo false`
          );

          return getLatestGlobalState();
        }

        return globalStateInfo;
      });
      console.info(`Global State is: ${globalStateDetails}`);

      return new Response(JSON.stringify({ globalStateDetails }));
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }
  },
};
