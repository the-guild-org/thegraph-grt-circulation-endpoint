export function validateAndExtractTokenFromRequest(request: Request): string {
  const header = request.headers.get("authorization");

  if (header == null) {
    throw new Error("Authorization header is missing");
  }

  const headerParts = header.split(" ");

  if (headerParts.length < 2) {
    throw new Error("Authorization header is missing");
  }

  if (headerParts[1] == null) {
    throw new Error("Authorization header is missing");
  }

  return headerParts[1];
}
