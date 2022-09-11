import { AllGlobalStatesQueryVariables } from "../types/get-all-global-states.types";

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

export async function getAllGlobalStates(
  variables: AllGlobalStatesQueryVariables
) {
  const grtInfo = await fetch(
    "https://api.thegraph.com/subgraphs/name/juanmardefago/dev-subgraph2",
    {
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: allGlobalStates,
        variables: variables,
      }),
      method: "POST",
    }
  )
    .then((r) => r.text())
    .then((r) => {
      const foundGlobalStates = r;

      if (foundGlobalStates === null || foundGlobalStates === undefined) {
        throw new Error(
          `Can't find any global states info for filter provided.`
        );
      }
      console.info(
        `Variables for getAllGlobalStates func is number. number =  ${variables.number}`
      );
      if (variables === null || variables === undefined) {
        throw new Error(
          `Variables for getAllGlobalStates func is null or undefined. Variables = ${variables}`
        );
      }

      return foundGlobalStates;
    });

  return grtInfo;
}
