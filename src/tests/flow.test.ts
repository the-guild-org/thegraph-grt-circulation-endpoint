import { describe, expect, test } from "@jest/globals";
import { flow } from "../utils/flow";

describe("Main flow", () => {
  test("Should return a valid response when timestamp param is valid", async () => {
    const timestamp = 1665295732;
    const result = await flow(timestamp);
    expect(result).not.toBeNull();
  });
  test("When Timestamp is Null -> Should return lastGlobalState values", async () => {
    const result = await flow();
    expect(result).not.toBeNull();
    expect(result).toContain("lastGlobalState");
  });
  test("When Timestamp is String -> Should return lastGlobalState values", async () => {
    const timestamp = "boop";
    const result = await flow(timestamp);
    expect(result).toThrowError();
  });
});
