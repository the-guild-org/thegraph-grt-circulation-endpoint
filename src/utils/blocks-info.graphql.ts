import {
  AllBlocksInfoQuery,
  AllBlocksInfoQueryVariables,
} from "../types/blocks-info.graphql";
import { fetchGraphQL } from "./fetch-graphql";

const allBlocksInfo = /* GraphQL */ `
  query allBlocksInfo(
    $blockFilter: Block_filter
    $orderDirection: OrderDirection
  ) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: $orderDirection
      where: $blockFilter
    ) {
      id
      number
      timestamp
    }
  }
`;

type BlockNumber = number;

export async function getBlockByTimestamp(
  timestamp: number
): Promise<BlockNumber | null> {
  const allBlocksInfoResponse = await fetchGraphQL<
    AllBlocksInfoQueryVariables,
    AllBlocksInfoQuery
  >({
    url: "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
    query: allBlocksInfo,
    variables: {
      blockFilter: {
        timestamp_gte: String(timestamp),
      },
    },
  });

  if (!allBlocksInfoResponse) {
    console.error("Failed to fetch latest block, response is empty");
    throw new Error("Failed to fetch latest block, response is empty");
  }

  // Sometimes the response is empty array "[]", or the value of field "number" is "1". In this case we should return null.
  return allBlocksInfoResponse.blocks.length === 0 ||
    allBlocksInfoResponse.blocks[0].number === "1"
    ? null
    : parseInt(allBlocksInfoResponse.blocks[0].number);
}

export async function getLatestBlock(): Promise<BlockNumber> {
  const allBlocksInfoResponse = await fetchGraphQL<
    AllBlocksInfoQueryVariables,
    AllBlocksInfoQuery
  >({
    url: "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
    query: allBlocksInfo,
    variables: {
      orderDirection: "desc",
    },
  });

  if (!allBlocksInfoResponse) {
    console.error(`${allBlocksInfoResponse}`);
    throw new Error("Failed to fetch latest block");
  }

  if (!allBlocksInfoResponse.blocks) {
    console.error(`${allBlocksInfoResponse}`);
    throw new Error("Failed to fetch latest block");
  }

  return parseInt(allBlocksInfoResponse.blocks[0].number);
}
