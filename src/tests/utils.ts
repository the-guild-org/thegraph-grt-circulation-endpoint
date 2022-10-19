export function mockFetch(
  method: "GET" | "POST",
  url: string,
  body: Record<string, any>,
  status = 200
) {
  const fetchMock = getMiniflareFetchMock();
  fetchMock.disableNetConnect();
  const urlObj = new URL(url);
  const origin = fetchMock.get(urlObj.origin);
  origin
    .intercept({
      method,
      path: urlObj.pathname,
    })
    .reply(status, JSON.stringify(body));

  return fetchMock;
}
