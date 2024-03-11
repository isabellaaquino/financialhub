export enum BarChartRangeOptions {
  LastWeek = 0,
  LastTwoWeeks = 1,
  LastMonth = 2,
}

export const PieChartRangeOptions = {
  Last30Days: { id: 0, amount: 30 },
  Last90Days: { id: 1, amount: 90 },
  Last180Days: { id: 2, amount: 180 },
};

export type PieChartRangeType =
  (typeof PieChartRangeOptions)[keyof typeof PieChartRangeOptions];

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
