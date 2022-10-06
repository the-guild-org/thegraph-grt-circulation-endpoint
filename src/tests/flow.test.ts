import { describe, expect, test } from "@jest/globals";
import {
  getBlockByTimestamp,
  getLatestBlock,
} from "../utils/blocks-info.graphql";
import moment from "moment";
import {
  getGlobalStateByBlockNumber,
  getLatestGlobalState,
} from "../utils/global-states.graphql";

describe("Main flow", () => {
  test("Should return a valid response when timestamp param is not valid", async () => {
    const todayTimestamp = moment().unix();
    const blockDetails = await getBlockByTimestamp(todayTimestamp).then(
      (blockInfo) => {
        if (!blockInfo) {
          return getLatestBlock();
        }
        return blockInfo;
      }
    );
    expect(blockDetails).not.toBeNull();
  });
  test("Should return valid GlobalState if blockDetails is not valid ", async () => {
    const blockDetails = 15653542;
    const globalStateDetails = await getGlobalStateByBlockNumber(
      blockDetails
    ).then(async (globalStateInfo) => {
      if (!globalStateInfo) {
        return getLatestGlobalState();
      }
      return globalStateInfo;
    });
    expect(globalStateDetails).not.toBeNull();
  });
});
