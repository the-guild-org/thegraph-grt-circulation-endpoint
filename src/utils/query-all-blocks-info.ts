const allBlocksInfo = /* GraphQL */ `
  query allBlocksInfo($timestamp_gte: String!) {
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

// export async function getAllBlocksInfo(
//   octokit: Octokit,
//   variables: AllOrganizationMembersQueryVariables
// ) {
//   const membersList = await octokit.graphql<AllOrganizationMembersQuery>(
//     allOrganizationMembers,
//     variables
//   );
//   const members = (membersList.organization?.membersWithRole.edges || []).map(
//     (v) => v?.node
//   );

//   return members;
// }
