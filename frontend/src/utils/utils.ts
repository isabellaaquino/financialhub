export function formatValue(value: number, limit: number): string {
  if (value < limit) {
    return parseInt(value.toString()).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const abbreviations = ["", "mil", "mi", "bi"];
  let abbreviationIndex = 0;

  while (value >= 1000) {
    value /= 1000;
    abbreviationIndex++;
  }

  return "R$" + value.toFixed(2) + abbreviations[abbreviationIndex];
}

export function getKeyByEnumValue(myEnum: any, enumValue: number | string) {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : "";
}

export type ResponseType = { [key: string]: string };

export function capitalizeStr(type: string) {
  const typeStr = type?.toString().toLowerCase();
  return typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
}
