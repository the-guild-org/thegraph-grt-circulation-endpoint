export function validateAndExtractTokenFromRequest(
  request: Request
): string | null {
  const header = request.headers.get("authorization");

  if (header == null) {
    return null;
  }

  const headerParts = header.split(" ");

  if (headerParts.length < 2) {
    return null;
  }

  if (headerParts[1] == null) {
    return null;
  }

  return headerParts[1];
}
