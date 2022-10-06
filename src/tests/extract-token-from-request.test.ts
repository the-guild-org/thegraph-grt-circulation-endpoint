import { describe, expect, test } from "@jest/globals";
import { validateAndExtractTokenFromRequest } from "../utils/validate-and-extract-token-from-request";

describe("extract-token-from-request", () => {
  test("When header is null -> throw error status 403", async () => {
    const request = new Request("http://www.example.com", {
      headers: {
        keys: "authorization",
        values: "Bearer 1234567890",
      },
    });
    console.log(request);
    const result = await validateAndExtractTokenFromRequest(request);
    expect(result).toThrow(Error);
  });
});
