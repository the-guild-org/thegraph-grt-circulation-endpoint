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

  if (!globalStateResponse) {
    console.error(`${globalStateResponse}`);
    throw new Error("Failed to fetch latest global state");
  }

  return globalStateResponse.globalStates[0];
}
