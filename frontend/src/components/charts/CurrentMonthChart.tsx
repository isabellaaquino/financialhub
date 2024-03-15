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
import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import {
  BarChartRangeOptions,
  BarChartRangeType,
  getBarChartOptionsById,
} from "../../enums/Enums";
import { useTransactions } from "../../hooks/api/useTransactions";
import { Transaction } from "../../models/Transaction";
import { darkTheme } from "../../theme";
import { barRangeOptionMask, getStartDate } from "../../utils/utils";

function CurrentMonthChart() {
  const { getTransactions } = useTransactions();
  const [range, setRange] = useState<BarChartRangeType>(
    BarChartRangeOptions.LastWeek
  );
  const [lineChartData, setLineChartData] = useState<
    { x: string; y: string | number }[]
  >([]);

  const endDate = new Date(new Date()); //TO-DO
  const startDate = useMemo(() => {
    return getStartDate(range);
  }, [range]);

  type PromiseType<T> = T extends Promise<infer U> ? U : T;

  const { data: transactions } = useQuery({
    queryKey: ["transactions", startDate],
    queryFn: () => getTransactions(0, 1, startDate, endDate),
  }) as { data: PromiseType<Transaction[]>; isLoading: boolean };

  const state = useMemo(() => {
    return {
      options: {
        chart: {
          toolbar: { show: false },
          id: "bar",
        },
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
        colors: [darkTheme.palette.primary.main],
        legend: {
          show: false,
        },
        xaxis: {
          type: "numeric",
          labels: {
            style: {
              colors: grey[700],
            },
            show: true,
            formatter: function (value: string) {
              return new Date(value).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              });
            },
          },
        },
        yaxis: {
          tickAmount: 5,
          labels: {
            show: true,
            style: {
              colors: grey[700],
            },
            formatter: function (val) {
              return val.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
            },
          },
        },
        grid: {
          show: true,
          borderColor: grey[900],
        },
        dataLabels: { enabled: false },
        tooltip: {
          theme: "dark",
          x: {
            formatter(val) {
              return String(val);
            },
          },
        },
      },
      series: [
        {
          name: "",
          data: lineChartData ?? [],
        },
      ],
    } as {
      options: ApexOptions;
      series: ApexOptions["series"];
    };
  }, [lineChartData]);

  useEffect(() => {
    const dataSet = transactions
      ? transactions
          .map((t) => {
            return { x: t.date, y: t.value };
          })
          .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
      : [];
    setLineChartData(dataSet);
  }, [transactions, range]);

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
          Daily expenses
        </Typography>
        <FormControl sx={{ width: "200px" }}>
          <InputLabel>Range</InputLabel>
          <Select
            size="small"
            value={range.id}
            label="Range"
            onChange={(e) =>
              setRange(getBarChartOptionsById(Number(e.target.value)))
            }
          >
            {Object.values(BarChartRangeOptions)
              .filter((key) => isNaN(Number(key)))
              .map((item, index) => {
                return (
                  <MenuItem key={index} value={item.id}>
                    {barRangeOptionMask(item)}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Box>

      {lineChartData.every((obj) => obj.y === 0) ? (
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
      ) : (
        <Chart
          options={state.options}
          series={state.series}
          type="bar"
          width="100%"
          height="300px"
        />
      )}
    </Box>
  );
}

export default CurrentMonthChart;
