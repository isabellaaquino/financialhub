export function formatValue(value: number, limit: number): string {
  if (value < limit) {
    return "$" + value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  }

  const abbreviations = ["", "mil", "mi", "bi"];
  let abbreviationIndex = 0;

  while (value >= 1000) {
    value /= 1000;
    abbreviationIndex++;
  }

  return "$" + value.toFixed(2) + abbreviations[abbreviationIndex];
}

export function getKeyByEnumValue(myEnum: any, enumValue: number | string) {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : "";
}
