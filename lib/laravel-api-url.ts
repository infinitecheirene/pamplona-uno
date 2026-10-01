export function getLaravelApiUrl(
  configuredUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
) {
  const baseUrl = configuredUrl.replace(/\/+$/, "");

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
}