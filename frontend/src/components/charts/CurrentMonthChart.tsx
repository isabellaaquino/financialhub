import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { darkTheme } from "../../theme";
import { useQuery } from "@tanstack/react-query";
import { useTransactions } from "../../hooks/api/useTransactions";

enum RangeOptions {
  LastWeek = 0,
  LastTwoWeeks = 1,
  LastMonth = 2,
}

function CurrentMonthChart() {
  const { getTransactions } = useTransactions();
  const [range, setRange] = useState<RangeOptions>(RangeOptions.LastWeek);
  const [lineChartData, setLineChartData] = useState<
    { x: string; y: string | number }[] | null
  >(null);

  const formatDataForCharts = true;
  const endDate = new Date("2024-03-04");
  const startDate = useMemo(() => {
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
  }, [range]);

  const { data: transactions } = useQuery({
    queryKey: ["transactions", startDate, endDate, formatDataForCharts],
    queryFn: () => getTransactions(0, startDate, endDate, formatDataForCharts),
  });

  const [state, setState] = useState<{
    options: ApexOptions;
    series: ApexOptions["series"];
  }>({
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
        stepSize: 250,
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
        data: [],
      },
    ],
  });

  useEffect(() => {
    const dataSet = transactions
      ? transactions
          .map((t) => {
            return { x: t.date, y: t.value };
          })
          .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
      : null;
    setLineChartData(dataSet);
  }, [transactions, range]);

  useEffect(() => {
    setState((prevState) => {
      return {
        options: {
          ...prevState.options,
        },
        series: [
          {
            ...prevState.series,
            data: lineChartData ?? [],
          },
        ],
      };
    });
  }, [lineChartData]);

  function rangeOptionMask(option: RangeOptions) {
    switch (option) {
      case RangeOptions.LastMonth:
        return "Last month";
      case RangeOptions.LastWeek:
        return "Last week";
      case RangeOptions.LastTwoWeeks:
        return "Last two weeks";
    }
  }

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
            value={range}
            label="Range"
            onChange={(e) => setRange(Number(e.target.value))}
          >
            {Object.keys(RangeOptions)
              .filter((key) => isNaN(Number(key)))
              .map((_, index) => {
                return (
                  <MenuItem key={index} value={index}>
                    {rangeOptionMask(index)}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Box>

      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        width="100%"
        height="300px"
      />
    </Box>
  );
}

export default CurrentMonthChart;
