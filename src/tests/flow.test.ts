import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { handleRequest } from "../utils/flow";
import { sign } from "@tsndr/cloudflare-worker-jwt";
import mockFetch from "jest-mock-fetch";
import fetch from "jest-mock-fetch";

async function buildValidRequest(timestamp: number | string | null) {
  const jwtVerifySecret = "fake";
  const validToken = await sign({}, jwtVerifySecret);
  const request = new Request(`https://fake.com/?timestamp=${timestamp}`, {
    headers: {
      Authorization: `Bearer ${validToken}`,
    },
  });

  return {
    jwtVerifySecret,
    request,
  };
}

describe("Request/Response flow", () => {
  beforeEach(() => {
    fetch.reset();
  });
  test.only("Should return a valid response when timestamp param is valid", async () => {
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
    expect(fetch.mock.calls[0][1]).toEqual(
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks"
    );
    const { request, jwtVerifySecret } = await buildValidRequest(1665295732);

    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/juanmardefago/grt-circulating-supply",
      {
        data: {
          globalStates: [
            {
              totalSupply: "10472593084278602817126230051",
              lockedSupply: "2481516171545208333333335778",
              lockedSupplyGenesis: "2406735547043125000000001983",
              liquidSupply: "7991076912733394483792894273",
              circulatingSupply: "8065857537235477817126228068",
            },
          ],
        },
      }
    );

    const response = await handleRequest(request, { jwtVerifySecret });
    expect(fetch.mock.calls.length).toEqual(2);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.objectContaining({
        totalSupply: expect.any(String),
        lockedSupply: expect.any(String),
        lockedSupplyGenesis: expect.any(String),
        liquidSupply: expect.any(String),
        circulatingSupply: expect.any(String),
      })
    );
  });
  test.only("When Timestamp is Null -> Should return lastGlobalState values", async () => {
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
    expect(fetch.mock.calls[0][1]).toEqual(
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks"
    );
    const { request, jwtVerifySecret } = await buildValidRequest(null);

    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/juanmardefago/grt-circulating-supply",
      {
        data: {
          globalStates: [
            {
              totalSupply: "10472593084278602817126230051",
              lockedSupply: "2481516171545208333333335778",
              lockedSupplyGenesis: "2406735547043125000000001983",
              liquidSupply: "7991076912733394483792894273",
              circulatingSupply: "8065857537235477817126228068",
            },
          ],
        },
      }
    );

    const response = await handleRequest(request, { jwtVerifySecret });
    expect(fetch.mock.calls.length).toEqual(4);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.objectContaining({
        totalSupply: expect.any(String),
        lockedSupply: expect.any(String),
        lockedSupplyGenesis: expect.any(String),
        liquidSupply: expect.any(String),
        circulatingSupply: expect.any(String),
      })
    );
  });

  test.only("When Timestamp is String -> Should return lastGlobalState values", async () => {
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
    expect(fetch.mock.calls[0][1]).toEqual(
      "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks"
    );
    const { request, jwtVerifySecret } = await buildValidRequest("boop");

    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/juanmardefago/grt-circulating-supply",
      {
        data: {
          globalStates: [
            {
              totalSupply: "10472593084278602817126230051",
              lockedSupply: "2481516171545208333333335778",
              lockedSupplyGenesis: "2406735547043125000000001983",
              liquidSupply: "7991076912733394483792894273",
              circulatingSupply: "8065857537235477817126228068",
            },
          ],
        },
      }
    );

    const response = await handleRequest(request, { jwtVerifySecret });
    expect(fetch.mock.calls.length).toEqual(6);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.objectContaining({
        totalSupply: expect.any(String),
        lockedSupply: expect.any(String),
        lockedSupplyGenesis: expect.any(String),
        liquidSupply: expect.any(String),
        circulatingSupply: expect.any(String),
      })
    );
  });
});
