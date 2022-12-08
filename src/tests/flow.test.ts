import { describe, expect, test } from "@jest/globals";
import { handleRequest } from "../utils/flow";
import { sign } from "@tsndr/cloudflare-worker-jwt";
import { mockFetch } from "./utils";

async function buildValidRequest(queryParam: string) {
  const jwtVerifySecret = "fake";
  const validToken = await sign({}, jwtVerifySecret);
  const request = new Request(`https://fake.com/${queryParam}`, {
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
  test("Should return a valid response when timestamp param is not valid", async () => {
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
    const { request, jwtVerifySecret } = await buildValidRequest(
      "?timestamp=!Ab3567"
    );

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
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain;charset=UTF-8"
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(8065857537.235477);
  });

  test("Should return a valid response when timestamp param is valid", async () => {
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
    const { request, jwtVerifySecret } = await buildValidRequest(
      `?timestamp=1665295732`
    );

    mockFetch(
      "POST",
      "https://api.thegraph.com/subgraphs/name/juanmardefago/grt-circulating-supply",
      {
        data: {
          globalStates: [
            {
              totalSupply: "20472593084278602817126230051",
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
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain;charset=UTF-8"
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(8065857537.235477);
  });

  test("When timestamp is empty -> Should return lastGlobalState values", async () => {
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
    const { request, jwtVerifySecret } = await buildValidRequest("?timestamp=");

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
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain;charset=UTF-8"
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(8065857537.235477);
  });

  test("When timestamp is not set -> Should return lastGlobalState values", async () => {
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
    const { request, jwtVerifySecret } = await buildValidRequest("");

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
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain;charset=UTF-8"
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(8065857537.235477);
  });

  test("When timestamp is not set -> Should return lastGlobalState value and divided", async () => {
    mockFetch(
      "POST",
      `https://api.thegraph.com/subgraphs/name/juanmardefago/grt-circulating-supply`,
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

    const { request, jwtVerifySecret } = await buildValidRequest("");
    const response = await handleRequest(request, { jwtVerifySecret });
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain;charset=UTF-8"
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(8065857537.235477);
  });
});
