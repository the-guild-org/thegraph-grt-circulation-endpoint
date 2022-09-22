import { describe, expect, test } from "@jest/globals";
import { getBlockNumberByTimestamp } from "../utils/get-all-blocks-info.graphql";

describe("getAllBlocksInfo", () => {
  // test("should throw an error when HTTP response is not 200", () => {});
  test("should throw an error when HTTP response is 200 but we got GraphQL errors", () => {
    // prepare
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        errors: [{ message: "oopsi boopsi" }],
      }
    );
    // run
    const result$ = getBlockNumberByTimestamp(1663851343873);
    // assert
    expect(result$).toThrow();
  });
  test("should throw an error when data does not contain any block (empty array)", async () => {
    // prepare
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        data: {
          blocks: [],
        },
      }
    );
    // run
    const result$ = getBlockNumberByTimestamp(1663851343873);
    // assert
    expect(result$).toThrow();
  });
  test("should return valid block number when 1 block is found", async () => {
    // prepare
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        data: {
          blocks: [
            {
              id: "0x88e96d4537bea4d9c05d12549907b32561d3bf31f45aae734cdc119f13406cb6",
              number: "1",
              timestamp: "1438269988",
            },
          ],
        },
      }
    );
    // run
    const blockNumber = await getBlockNumberByTimestamp(1);
    // assert
    expect(blockNumber).toBeDefined();
    expect(typeof blockNumber).toBe("number");
    expect(blockNumber).toBe(1);
  });
  // test("should return valid block number when >1 block is found", () => {});
});
