import { describe, expect, test } from "@jest/globals";
import { mockFetch } from "./utils";
import { getBlockByTimestamp } from "../utils/blocks-info.graphql";

describe("getAllBlocksInfo", () => {
  test("When we got 0 blocks -> we should return Null", async () => {
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        data: {
          blocks: [],
        },
      },
      200
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
      },
      200
    );
    const result = await getBlockByTimestamp(1664630066);
    expect(result).not.toBeNull();
    expect(typeof result).toEqual("number");
  });
  test("In case of block '1' -> we return `null and not a valid block number.", async () => {
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
      },
      200
    );
    const result = await getBlockByTimestamp(1);
    expect(result).toBeNull();
  });

  test("Should throw error when we got HTTP 200 + GraphQL error", async () => {
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
      },
      200
    );
    const result$ = getBlockByTimestamp(1);
    await expect(result$).rejects.toEqual(
      new Error(
        "GraphQL Errors: Failed to decode `BigInt` value: `cannot parse integer from empty string`"
      )
    );
  });

  test("Should throw error when we got HTTP non-200", async () => {
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {},
      500
    );
    const result$ = getBlockByTimestamp(1);
    await expect(result$).rejects.toEqual(
      new Error("Invalid GraphQL status code: 500")
    );
  });
});
