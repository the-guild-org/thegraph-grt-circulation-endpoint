import {
  AllGlobalStatesQueryVariables,
  AllGlobalStatesQuery,
} from "../types/get-all-global-states.types";
import { fetchGraphQL } from "./fetch-graphql";

const allGlobalStates = /* GraphQL */ `
  query allGlobalStates(
    $blockFilter: Block_height
    $orderDirection: OrderDirection
  ) {
    globalStates(block: $blockFilter, orderDirection: $orderDirection) {
      totalSupply
      lockedSupply
      lockedSupplyGenesis
      liquidSupply
      circulatingSupply
    }
  }
`;

export async function getLatestGlobalState() {
  // 1: we got HTTP 200 with "data" set
  // 2: we got HTTP 200 with "errors" set -> throw an error
  // 3: we got HTTP != 200 -> throw an error
  const globalStateResponse = await fetchGraphQL<
    AllGlobalStatesQueryVariables,
    AllGlobalStatesQuery
  >({
    url: "https://api.thegraph.com/subgraphs/name/juanmardefago/dev-subgraph2",
    query: allGlobalStates,
    variables: {
      orderDirection: "desc",
    },
  });

  // 1: "globalStates" is empty array -> no "[0]" -> what are we doing?!
  // 2: what are we doing in case of globalStates.length > 1 ?
  return globalStateResponse.globalStates[0];
}
