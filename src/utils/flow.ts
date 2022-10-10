import jwt from "@tsndr/cloudflare-worker-jwt";
import { getBlockByTimestamp, getLatestBlock } from "./blocks-info.graphql";
import {
  getGlobalStateByBlockNumber,
  getLatestGlobalState,
} from "./global-states.graphql";
import { validateAndExtractTokenFromRequest } from "./validate-and-extract-token-from-request";

export async function handleRequest(
  request: Request,
  options: {
    jwtVerifySecret: string;
  }
): Promise<Response> {
  try {
    const urlParams = new URL(request.url);
    const params = Object.fromEntries(urlParams.searchParams);
    const token = validateAndExtractTokenFromRequest(request);

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing Token" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const isValid = await jwt.verify(token, options.jwtVerifySecret);
    console.info(
      `Authorization was trying to verify. The Authorization State: ${isValid}`
    );
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const timestamp = params.timestamp ? parseInt(params.timestamp) : null;

    console.info(
      `Params timestamp is: ${params.timestamp}, Timestamp for blockDetails: ${timestamp}`
    );

    if (!timestamp) {
      const lastGlobalState = await getLatestGlobalState();

      return new Response(JSON.stringify(lastGlobalState), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      const blockDetails = await getBlockByTimestamp(timestamp).then(
        (blockInfo) => {
          console.info(`blockDetails - blockInfo is:`, blockInfo);
          if (!blockInfo) {
            return getLatestBlock();
          }

          return blockInfo;
        }
      );

      console.info(`blockDetails is:`, blockDetails);

      const globalStateDetails = await getGlobalStateByBlockNumber(
        blockDetails
      ).then((globalStateInfo) => {
        console.info(`globalStateDetails - blockInfo is:`, globalStateInfo);
        if (globalStateInfo == null) {
          console.info(`globalStateInfo is missing:`, globalStateInfo);

          return getLatestGlobalState();
        }

        return globalStateInfo;
      });

      console.info(`Global State is:`, globalStateDetails);

      return new Response(JSON.stringify(globalStateDetails), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      "Something went wrong - Please try again later or contact support"
    );
  }
}
