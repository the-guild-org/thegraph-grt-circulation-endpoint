import { describe, expect, test } from "@jest/globals";
import mockFetch from "jest-mock-fetch";
import { getLatestBlock } from "../utils/get-latest-block.graphql";

describe("getLatestBlock", () => {
  test("should throw an error when HTTP response is 200 but we got GraphQL errors", () => {
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        data: {
          blocks: [
            {
              id: "0x28fc08941819e16ebc4591bc06258bd0ec8d2ca06d4c6d1edba5cf3dac924e01",
              number: "15638651",
              timestamp: "1664450255",
            },
          ],
        },
      }
    );
    const result$ = getLatestBlock();
    expect(result$);
  });
  test("The result should be Number", () => {
    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
      {
        data: {
          blocks: [
            {
              id: "0x28fc08941819e16ebc4591bc06258bd0ec8d2ca06d4c6d1edba5cf3dac924e01",
              number: "15638651",
              timestamp: "1664450255",
            },
          ],
        },
      }
    );
    const result$ = getLatestBlock();
    expect(result$).not.toBeNull();
  });
});
