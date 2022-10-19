import { describe, expect, test } from "@jest/globals";
import { patchResponse } from "../utils/flow";

describe("patchResponse function", () => {
  test("Should responed divided number when we put string", () => {
    const result = patchResponse({
      totalSupply: "10472593084278602817126230051",
      lockedSupply: "2481516171545208333333335778",
      lockedSupplyGenesis: "2406735547043125000000001983",
      liquidSupply: "7991076912733394483792894273",
      circulatingSupply: "8065857537235477817126228068",
    });
    expect.objectContaining({
      totalSupply: 1047259308.4278603,
      lockedSupply: 248151617.15452084,
      lockedSupplyGenesis: 240673554.7043125,
      liquidSupply: 799107691.2733394,
      circulatingSupply: 806585753.7235478,
    });
  });
  test("Null response is not allowed", () => {
    const result = patchResponse({
      totalSupply: "10472593084278602817126230051",
      lockedSupply: "2481516171545208333333335778",
      lockedSupplyGenesis: "2406735547043125000000001983",
      liquidSupply: "7991076912733394483792894273",
      circulatingSupply: "8065857537235477817126228068",
    });
    expect.objectContaining({
      totalSupply: expect(result.totalSupply).not.toBeNull(),
      lockedSupply: expect(result.lockedSupply).not.toBeNull(),
      lockedSupplyGenesis: expect(result.lockedSupplyGenesis).not.toBeNull(),
      liquidSupply: expect(result.liquidSupply).not.toBeNull(),
      circulatingSupply: expect(result.circulatingSupply).not.toBeNull(),
    });
  });
  test("NaN response is not allowed", () => {
    const result = patchResponse({
      totalSupply: "10472593084278602817126230051",
      lockedSupply: "2481516171545208333333335778",
      lockedSupplyGenesis: "2406735547043125000000001983",
      liquidSupply: "7991076912733394483792894273",
      circulatingSupply: "8065857537235477817126228068",
    });
    expect.objectContaining({
      totalSupply: expect(result.totalSupply).not.toBeNaN(),
      lockedSupply: expect(result.lockedSupply).not.toBeNaN(),
      lockedSupplyGenesis: expect(result.lockedSupplyGenesis).not.toBeNaN(),
      liquidSupply: expect(result.liquidSupply).not.toBeNaN(),
      circulatingSupply: expect(result.circulatingSupply).not.toBeNaN(),
    });
  });
  test("Response must be Number type", () => {
    const result = patchResponse({
      totalSupply: "10472593084278602817126230051",
      lockedSupply: "2481516171545208333333335778",
      lockedSupplyGenesis: "2406735547043125000000001983",
      liquidSupply: "7991076912733394483792894273",
      circulatingSupply: "8065857537235477817126228068",
    });
    expect.objectContaining({
      totalSupply: expect(typeof result.totalSupply).toEqual("number"),
      lockedSupply: expect(typeof result.lockedSupply).toEqual("number"),
      lockedSupplyGenesis: expect(typeof result.lockedSupplyGenesis).toEqual(
        "number"
      ),
      liquidSupply: expect(typeof result.liquidSupply).toEqual("number"),
      circulatingSupply: expect(typeof result.circulatingSupply).toEqual(
        "number"
      ),
    });
  });
});
