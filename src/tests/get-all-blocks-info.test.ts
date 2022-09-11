import { AllBlocksInfoQueryVariables } from "../types/get-all-blocks-info.types";
import { getAllBlocksInfo } from "../utils/get-all-blocks-info.graphql";
import { describe, expect, test } from "@jest/globals";

const variables: AllBlocksInfoQueryVariables = {
  timestamp_gte: "1630000000",
};

describe("getAllBlocksInfo function", () => {
  test("getAllBlocksInfo not to be Null | Falsy | Undefined", () => {
    expect(getAllBlocksInfo(variables)).not.toBeNull();
    expect(getAllBlocksInfo(variables)).not.toBeFalsy();
    expect(getAllBlocksInfo(variables)).not.toBeUndefined();
  });
});
