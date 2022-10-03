import {
  AllBlocksInfoQueryVariables,
  AllBlocksInfoQuery,
} from "../types/get-all-blocks-info.types";
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

type BlockNumber = number | null;

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
