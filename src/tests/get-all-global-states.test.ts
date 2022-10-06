import { describe, expect, test } from "@jest/globals";
import mockFetch from "jest-mock-fetch";
import { getBlockByTimestamp } from "../utils/blocks-info.graphql";

describe("getAllGlobalStates", () => {
  test("When we got 0 blocks -> we should return Null", async () => {
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        data: {
          blocks: [],
        },
      }
    );
    const result = await getBlockByTimestamp(121212121212121212);
    expect(result).toBeNull();
  });

  test("When we got valid timestamp -> we should return Number", async () => {
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        data: {
          blocks: [
            {
              id: "0xd125365fb2839beefb583319429a544da58758548a0454fddb9fed553ed94b06",
              number: "15653542",
              timestamp: "1664630075",
            },
          ],
        },
      }
    );
    const result = await getBlockByTimestamp(1664630066);
    expect(result).not.toBeNull();
    expect(result).toEqual(expect.any(Number));
  });
  test("should return valid block number when 1 block is found", async () => {
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
    const result = await getBlockByTimestamp(1);
    expect(result).toBeNull();
  });
  test("Shoudl throw error when we got HTTP 300/400/500", async () => {
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        errors: [
          {
            message:
              "Failed to decode `BigInt` value: `cannot parse integer from empty string`",
          },
        ],
      }
    );
    const result = await getBlockByTimestamp(1);
    expect(result).toBeNull();
  });
});
