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

  if (response.status !== 200) {
    throw new Error(`Invalid GraphQL status code: ${response.status}`);
  }

  const body = await response.json<ExecutionResult<TResponse>>();

  if (body.errors && body.errors.length > 0) {
    console.log(`${body.errors}`);
    throw new Error(
      `GraphQL Errors: ${body.errors.map((e) => e.message).join(",")}`
    );
  }

  if (!body.data) {
    console.log(`${body.data}`);
    throw new Error(`GraphQL Error: unexpected empty response`);
  }

  return body.data!;
}
