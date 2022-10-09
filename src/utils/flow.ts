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
  const urlParams = new URL(request.url);
  const params = Object.fromEntries(urlParams.searchParams);
  const token = validateAndExtractTokenFromRequest(request);

  if (!token) {
    return new Response("Missing Token", {
      status: 403,
    });
  }

  const isValid = await jwt.verify(token, options.jwtVerifySecret);
  console.info(
    `Authorization was trying to verify. The Authorization State: ${isValid}`
  );
  if (!isValid) {
    return new Response("Unauthorized", {
      status: 403,
    });
  }

  const timestamp = params.timestamp ? parseInt(params.timestamp) : null;

  console.info(
    `Params timestamp is: ${params.timestamp}, Timestamp for blockDetails: ${timestamp}`
  );
  if (!timestamp) {
    const lastGlobalState = await getLatestGlobalState();
    return new Response(JSON.stringify({ lastGlobalState }));
  } else {
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
  }
}

export async function flow(timestamp?: number): Promise<string | undefined> {
  if (!timestamp) {
    const lastGlobalState = await getLatestGlobalState();
    return JSON.stringify({ lastGlobalState });
  } else {
    const blockDetails = await getBlockByTimestamp(timestamp).then(
      (blockInfo) => {
        if (!blockInfo) {
          return getLatestBlock();
        }

        return blockInfo;
      }
    );

    const globalStateDetails = await getGlobalStateByBlockNumber(
      blockDetails
    ).then((globalStateInfo) => {
      if (globalStateInfo == null) {
        return getLatestGlobalState();
      }

      return globalStateInfo;
    });

    JSON.stringify({ globalStateDetails });
  }
}
