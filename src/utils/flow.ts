import jwt from "@tsndr/cloudflare-worker-jwt";
import { AllGlobalStatesQuery } from "../types/global-states.graphql";
import { getBlockByTimestamp, getLatestBlock } from "./blocks-info.graphql";
import {
  getGlobalStateByBlockNumber,
  getLatestGlobalState,
} from "./global-states.graphql";
import { validateAndExtractTokenFromRequest } from "./validate-and-extract-token-from-request";
import { Decimal } from "decimal.js";

const DIVISION_NUMBER = 1000000000000000000;

export function createErrorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

type PatchResponse = {
  [Property in keyof Omit<
    AllGlobalStatesQuery["globalStates"][number],
    "__typename"
  >]: number;
};

function getDividedNumberFromResult(input: string) {
  return new Decimal(input).dividedBy(DIVISION_NUMBER).toNumber();
}

export function patchResponse(
  source: AllGlobalStatesQuery["globalStates"][number]
): PatchResponse {
  return {
    totalSupply: getDividedNumberFromResult(source.totalSupply),
    lockedSupply: getDividedNumberFromResult(source.lockedSupply),
    lockedSupplyGenesis: getDividedNumberFromResult(source.lockedSupplyGenesis),
    liquidSupply: getDividedNumberFromResult(source.liquidSupply),
    circulatingSupply: getDividedNumberFromResult(source.circulatingSupply),
  };
}

function createValidResponse(
  globalState: AllGlobalStatesQuery["globalStates"][number]
): Response {
  const patchedResponse = patchResponse(globalState);
  return new Response(JSON.stringify(patchedResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function createCirculatingSupplyResponse(
  globalState: AllGlobalStatesQuery["globalStates"][number]
): Response {
  const patchedResponse = patchResponse(globalState);
  return new Response(patchedResponse.circulatingSupply);
}

function createTotalsupplyResponse(
  globalState: AllGlobalStatesQuery["globalStates"][number]
): Response {
  const patchedResponse = patchResponse(globalState);
  return new Response(patchedResponse.totalSupply);
}

export async function handleRequest(
  request: Request,
  options: {
    jwtVerifySecret: string;
  }
): Promise<Response> {
  try {
    const urlParams = new URL(request.url);
    const params = Object.fromEntries(urlParams.searchParams);

    const totalSupply = request.url.endsWith("/total-supply");
    if (totalSupply) {
      const lastGlobalState = await getLatestGlobalState();
      console.log("Total Supply Request");
      return createTotalsupplyResponse(lastGlobalState);
    }

    const circulatingSupply = request.url.endsWith("/circulating-supply");
    if (circulatingSupply) {
      const lastGlobalState = await getLatestGlobalState();
      console.log("Circulating Supply Request");
      return createCirculatingSupplyResponse(lastGlobalState);
    }

    const token = validateAndExtractTokenFromRequest(request);
    if (!token) {
      return createErrorResponse("Missing Token", 400);
    }
    const isValid = await jwt.verify(token, options.jwtVerifySecret);
    console.info(
      `Authorization was trying to verify. The Authorization State: ${isValid}`
    );

    const timestamp = params.timestamp ? parseInt(params.timestamp) : null;
    console.log(`timestamp is:`, timestamp);

    if (timestamp) {
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

      return createValidResponse(globalStateDetails);
    } else {
      const lastGlobalState = await getLatestGlobalState();
      console.log("Latest Global State");
      return createValidResponse(lastGlobalState);
    }
  } catch (error) {
    console.error(error);

    return createErrorResponse(
      "Something went wrong - Please try again later or contact support",
      500
    );
  }
}
