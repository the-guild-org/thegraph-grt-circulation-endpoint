import { describe, expect, test } from "@jest/globals";
import { handleRequest } from "../utils/flow";
import { sign } from "@tsndr/cloudflare-worker-jwt";

async function buildValidRequest(timestamp: number) {
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
  test.only("Should return a valid response when timestamp param is valid", async () => {
    const { request, jwtVerifySecret } = await buildValidRequest(1665295732);
    const response = await handleRequest(request, { jwtVerifySecret });

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

  // test("When Timestamp is Null -> Should return lastGlobalState values", async () => {
  //   const result = await flow();
  //   expect(result).not.toBeNull();
  //   expect(result).toContain("lastGlobalState");
  // });

  // test("When Timestamp is String -> Should return lastGlobalState values", async () => {
  //   const timestamp = "boop";
  //   // @ts-expect-error
  //   const result = await flow(timestamp);
  //   expect(result).toThrowError();
  // });
});
