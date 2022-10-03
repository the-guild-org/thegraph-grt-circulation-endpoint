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
    console.error(`${body.errors}`);
    throw new Error(
      `ERROR: body.errors[0].message: ${body.errors[0].message} is throw error`
    );
  }
  if (!body.data) {
    console.error(`${body.data}`);
    throw new Error(`ERROR: body.data: ${body.data} is throw error`);
  }
  if (!body) {
    console.error(`${body}`);
    throw new Error(`ERROR: body: ${body} is throw error`);
  }

  return body.data!;
}
