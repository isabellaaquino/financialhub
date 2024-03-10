import { RangeOptions } from "../enums/Enums";

export function formatValue(value: number, limit: number): string {
  if (value < limit) {
    return parseFloat(value.toString()).toLocaleString("pt-BR", {
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

  return value
    ? "R$" + value.toFixed(2) + abbreviations[abbreviationIndex]
    : "";
}

export function formatCurrency(value: string) {
  let formattedValue = value.replace(/\D/g, "");
  formattedValue = formattedValue.replace(/(\d)(\d{2})$/, "$1,$2");
  formattedValue = formattedValue.replace(/(?=(\d{3})+(\D))\B/g, ".");

  return formattedValue;
}

export function getStartDate(range: RangeOptions) {
  if (range === RangeOptions.LastWeek) {
    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 6
    );
    return lastWeek;
  } else if (range === RangeOptions.LastTwoWeeks) {
    const today = new Date();
    const lastTwoWeeks = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 13
    );
    return lastTwoWeeks;
  } else {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 29
    );
    return lastMonth;
  }
}

export function rangeOptionMask(option: RangeOptions) {
  switch (option) {
    case RangeOptions.LastMonth:
      return "Last month";
    case RangeOptions.LastWeek:
      return "Last week";
    case RangeOptions.LastTwoWeeks:
      return "Last two weeks";
  }
}
