import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useQuery } from "@tanstack/react-query";
import { ApexOptions } from "apexcharts";
import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import {
  PieChartRangeOptions,
  PieChartRangeType,
  getPieChartOptionById,
} from "../../enums/Enums";
import { useTransactions } from "../../hooks/api/useTransactions";
import { AggregatedExpense } from "../../models/Transaction";
import { darkTheme } from "../../theme";
import { getStartDate, pieRangeOptionMask } from "../../utils/utils";

function ProfileChart() {
  const { getTransactions } = useTransactions();

  const [range, setRange] = useState<PieChartRangeType>(
    PieChartRangeOptions.Last30Days
  );

  const endDate = new Date(new Date()); //TO-DO
  const startDate = useMemo(() => {
    return getStartDate(range);
  }, [range]);

  type PromiseType<T> = T extends Promise<infer U> ? U : T;

  const { data: transactions } = useQuery({
    queryKey: ["transactions", startDate],
    queryFn: () => getTransactions(0, 2, startDate, endDate),
  }) as { data: PromiseType<AggregatedExpense[]> };

  const colors = transactions
    ? transactions.map((obj: AggregatedExpense) => obj.label_color)
    : [];
  const amounts = transactions
    ? transactions.map((obj: AggregatedExpense) => obj.value)
    : [];
  const labels = transactions
    ? transactions.map((obj: AggregatedExpense) => obj.label_name)
    : [];

  const state = useMemo<{
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    options: ApexOptions;
  }>(() => {
    return {
      series: amounts,
      options: {
        labels: labels,
        colors: colors,
        chart: {
          id: "pie",
          toolbar: { show: false },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
          position: "left",
          labels: {
            colors: grey[600],
          },
        } as ApexLegend,
        yaxis: {
          labels: {
            formatter: function (val) {
              return val.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
            },
          },
        },
        stroke: {
          show: false,
        },
      },
    };
  }, [transactions]);

  return (
    <Box
      border="1px solid"
      borderColor={darkTheme.palette.background.paper}
      borderRadius={2}
      padding={3}
      height={380}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography component="h2" variant="body1" mb={1}>
          Expenses Distribution
        </Typography>
        <FormControl sx={{ width: "20%" }}>
          <InputLabel>Range</InputLabel>
          <Select
            size="small"
            value={range.id}
            label="Range"
            onChange={(e) =>
              setRange(getPieChartOptionById(Number(e.target.value)))
            }
          >
            {Object.values(PieChartRangeOptions).map((item, index) => {
              return (
                <MenuItem key={index} value={item.id}>
                  {pieRangeOptionMask(item)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      {transactions ? (
        <Chart
          options={state.options}
          series={state.series}
          type="pie"
          width="90%"
          height="300px"
        />
      ) : (
        <Typography
          component="p"
          variant="body1"
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 14,
            textAlign: "center",
          }}
        >
          Unable to load chart due to insufficient data.
        </Typography>
      )}
    </Box>
  );
}

export default ProfileChart;
