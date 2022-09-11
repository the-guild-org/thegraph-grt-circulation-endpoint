import { ExecutionResult } from "graphql";
import {
  AllBlocksInfoQueryVariables,
  AllBlocksInfoQuery,
} from "../types/get-all-blocks-info.types";

const allBlocksInfo = /* GraphQL */ `
  query allBlocksInfo($timestamp_gte: BigInt!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gte: $timestamp_gte }
    ) {
      id
      number
      timestamp
    }
  }
`;

export async function getAllBlocksInfo(variables: AllBlocksInfoQueryVariables) {
  const blockNumber = await fetch(
    "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
    {
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: allBlocksInfo,
        variables: variables,
      }),
      method: "POST",
    }
  )
    .then((r) => r.json<ExecutionResult<AllBlocksInfoQuery>>())
    .then((r) => {
      const foundBlocks = r.data?.blocks || [];

      if (foundBlocks.length === 0) {
        throw new Error(`Can't find any block info for filter provided.`);
      }
      if (foundBlocks === null || foundBlocks === undefined) {
        throw new Error(`foundBlocks is null or undefined.`);
      }
      console.info(
        `Variables for getAllBlocksInfo func is timestamp_gte. timestamp_gte =  ${variables.timestamp_gte}`
      );

      return foundBlocks[0].number;
    });

  if (Number(blockNumber) < 11446768) {
    throw new Error(
      `blockNumber is less than 11446768. blockNumber = ${blockNumber}`
    );
  }
  return blockNumber;
}
