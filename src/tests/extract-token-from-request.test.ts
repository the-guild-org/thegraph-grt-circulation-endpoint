import { describe, expect, test } from "@jest/globals";
import { validateAndExtractTokenFromRequest } from "../utils/validate-and-extract-token-from-request";

describe("extract-token-from-request", () => {
  test("When Request Headers get null -> Return Null", () => {
    const request = new Request("http://www.example.com", {
      headers: {
        Header: "Bearer 1234567890",
      },
    });
    const result = validateAndExtractTokenFromRequest(request);
    expect(result).toBeNull();
  });
  test("When Request Headers is empty string -> Return Null", () => {
    const request = new Request("http://www.example.com", {
      headers: {
        Header: " ",
      },
    });
    const result = validateAndExtractTokenFromRequest(request);
    expect(result).toBeNull();
  });
  test("When Request Headers get only Bearer -> Return Null", () => {
    const request = new Request("http://www.example.com", {
      headers: {
        Header: "Bearer",
      },
    });
    const result = validateAndExtractTokenFromRequest(request);
    expect(result).toBeNull();
  });
  test("When Request Headers is undefined -> Return Null", () => {
    const request = new Request("http://www.example.com", {
      headers: undefined,
    });
    const result = validateAndExtractTokenFromRequest(request);
    expect(result).toBeNull();
  });
});
