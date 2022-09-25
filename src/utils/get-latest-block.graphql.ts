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
  // 1: we got HTTP 200 with "data" set
  // 2: we got HTTP 200 with "errors" set -> throw an error
  // 3: we got HTTP != 200 -> throw an error
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

  // 1: blocks is empty array -> no "[0]" -> what are we doing?!
  // 2: what are we doing in case blocks.length > 1 ?
  // 3: what are we doing in case of failing parseInt? (number => "boop" -> NaN)
  return !allBlocksInfoResponse
    ? null
    : parseInt(allBlocksInfoResponse.blocks[0].number);
}
