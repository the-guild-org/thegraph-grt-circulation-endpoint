import { getBlockByTimestamp, getLatestBlock } from "./blocks-info.graphql";
import {
  getGlobalStateByBlockNumber,
  getLatestGlobalState,
} from "./global-states.graphql";

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
