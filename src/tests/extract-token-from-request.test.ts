import { describe, expect, test } from "@jest/globals";
import { validateAndExtractTokenFromRequest } from "../utils/validate-and-extract-token-from-request";

describe("extract-token-from-request", () => {
  test("When header is null -> throw error status 403", () => {
    
    const result = validateAndExtractTokenFromRequest(request);
    expect(result).toThrowError("Authader is missing");
  });
});
