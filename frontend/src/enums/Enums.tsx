export const BarChartRangeOptions = {
  LastWeek: { id: 0, amount: 6 },
  LastTwoWeeks: { id: 1, amount: 13 },
  LastMonth: { id: 2, amount: 29 },
};

export const PieChartRangeOptions = {
  Last30Days: { id: 0, amount: 30 },
  Last90Days: { id: 1, amount: 90 },
  Last180Days: { id: 2, amount: 180 },
};

export type PieChartRangeType =
  (typeof PieChartRangeOptions)[keyof typeof PieChartRangeOptions];

export type BarChartRangeType =
  (typeof BarChartRangeOptions)[keyof typeof BarChartRangeOptions];

export function getBarChartOptionsById(id: number): BarChartRangeType {
  const foundOption = Object.entries(BarChartRangeOptions).find(
    ([_, value]) => value.id === id
  );
  return foundOption?.[1] as BarChartRangeType;
}

export function getPieChartOptionById(id: number): PieChartRangeType {
  const foundOption = Object.entries(PieChartRangeOptions).find(
    ([_, value]) => value.id === id
  );
  return foundOption?.[1] as PieChartRangeType;
}

export enum TypeOption {
  EXPENSE = "EXPENSE",
  EARNING = "EARNING",
}
