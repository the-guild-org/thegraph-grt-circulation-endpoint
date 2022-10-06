import { describe, expect, test } from "@jest/globals";
import mockFetch from "jest-mock-fetch";
import { getLatestBlock } from "../utils/blocks-info.graphql";

describe("getLatestBlock", () => {
  test("should throw an error when HTTP response is 200 but we got GraphQL errors", async () => {
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
    const result$ = await getLatestBlock();
    expect(result$).not.toBeNull();
  });
  test("The result should be Number", async () => {
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
    const result$ = await getLatestBlock();
    expect(typeof result$).toEqual("number");
  });
});
