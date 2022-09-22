import { ExecutionResult } from "graphql";

export async function fetchGraphQL<TVariables, TResponse>(input: {
  url: string;
  query: string;
  variables: TVariables;
}): Promise<TResponse> {
  const response = await fetch(input.url, {
    headers: {
      accept: "*/*",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: input.query,
      variables: input.variables,
    }),
    method: "POST",
  });

  const body = await response.json<ExecutionResult<TResponse>>();

  if (body.errors && body.errors.length > 0) {
    throw new Error(`Failed to run GraphQL query: ${body.errors[0].message}`);
  }

  return body.data!;
}
