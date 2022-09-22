import { ExecutionResult } from "graphql";
import {
  AllGlobalStatesQueryVariables,
  AllGlobalStatesQuery,
} from "../types/get-all-global-states.types";
import { fetchGraphQL } from "./fetch-graphql";

const allGlobalStates = /* GraphQL */ `
  query allGlobalStates($number: Int!) {
    globalStates(block: { number: $number }) {
      totalSupply
      lockedSupply
      lockedSupplyGenesis
      liquidSupply
      circulatingSupply
    }
  }
`;

export async function getGlobalStateByBlockNumber(blockNumber: number) {
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
      number: blockNumber,
    },
  });

  // 1: "globalStates" is empty array -> no "[0]" -> what are we doing?!
  // 2: what are we doing in case of globalStates.length > 1 ? 
  return globalStateResponse.globalStates[0];

  // const grtInfo = await fetch(
  //   "https://api.thegraph.com/subgraphs/name/juanmardefago/dev-subgraph2",
  //   {
  //     headers: {
  //       accept: "*/*",
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       query: allGlobalStates,
  //       variables: variables,
  //     }),
  //     method: "POST",
  //   }
  // )
  //   .then((r) => r.text())
  //   .then((r) => {
  //     const foundGlobalStates = r;

  //     if (foundGlobalStates === null || foundGlobalStates === undefined) {
  //       throw new Error(
  //         `Can't find any global states info for filter provided.`
  //       );
  //     }
  //     console.info(
  //       `Variables for getAllGlobalStates func is number. number =  ${variables.number}`
  //     );
  //     if (variables === null || variables === undefined) {
  //       throw new Error(
  //         `Variables for getAllGlobalStates func is null or undefined. Variables = ${variables}`
  //       );
  //     }

  //     return foundGlobalStates;
  //   });

  // return grtInfo;
}
