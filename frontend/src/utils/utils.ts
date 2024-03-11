import {
  BarChartRangeOptions,
  PieChartRangeOptions,
  PieChartRangeType,
} from "../enums/Enums";

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

export function getStartDateBarChart(range: BarChartRangeOptions) {
  if (range === BarChartRangeOptions.LastWeek) {
    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 6
    );
    return lastWeek;
  } else if (range === BarChartRangeOptions.LastTwoWeeks) {
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

export function getStartDatePieChart(range: PieChartRangeType) {
  const today = new Date();

  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - range.amount
  );

  return startDate;
}

export function barRangeOptionMask(option: BarChartRangeOptions) {
  switch (option) {
    case BarChartRangeOptions.LastMonth:
      return "Last month";
    case BarChartRangeOptions.LastWeek:
      return "Last week";
    case BarChartRangeOptions.LastTwoWeeks:
      return "Last two weeks";
  }
}

export function pieRangeOptionMask(option: PieChartRangeType) {
  switch (option) {
    case PieChartRangeOptions.Last30Days:
      return "Last 30 days";
    case PieChartRangeOptions.Last90Days:
      return "Last 90 days";
    case PieChartRangeOptions.Last180Days:
      return "Last 180 days";
  }
}
