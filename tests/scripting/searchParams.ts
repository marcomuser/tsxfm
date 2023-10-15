export function searchParams(): string | null {
  const url = new URL(import.meta.url);
  const searchParams = url.searchParams.get("hello");
  return searchParams;
}
