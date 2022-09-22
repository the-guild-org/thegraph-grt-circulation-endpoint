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
  const data = body.data;

  return data!;
}
