export type ResponseType = { [key: string]: string };

export function capitalizeStr(type: string) {
  const typeStr = type?.toString().toLowerCase();
  return (typeStr.charAt(0).toUpperCase() + typeStr.slice(1));
}
