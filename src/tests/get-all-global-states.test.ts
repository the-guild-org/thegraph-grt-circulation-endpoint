import { getAllGlobalStates } from "../utils/get-all-global-states.graphql";
import { describe, expect, test } from "@jest/globals";
import { AllGlobalStatesQueryVariables } from "../types/get-all-global-states.types";

const variables: AllGlobalStatesQueryVariables = {
  number: 11446768,
};

describe("getAllGlobalStates function", () => {
  test("getAllGlobalStates not to be Null | Falsy | Undefined", () => {
    expect(getAllGlobalStates(variables)).not.toBeNull();
    expect(getAllGlobalStates(variables)).not.toBeFalsy();
    expect(getAllGlobalStates(variables)).not.toBeUndefined();
  });
});
