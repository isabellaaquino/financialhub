import { ApexOptions } from "apexcharts";
import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
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
import { getStartDate, rangeOptionMask } from "../../utils/utils";

export enum RangeOptions {
  LastWeek = 0,
  LastTwoWeeks = 1,
  LastMonth = 2,
}

function CurrentMonthChart() {
  const { getTransactions } = useTransactions();
  const [range, setRange] = useState<RangeOptions>(RangeOptions.LastWeek);
  const [lineChartData, setLineChartData] = useState<
    { x: string; y: string | number }[]
  >([]);

  const formatDataForCharts = true;
  const endDate = new Date("2024-03-04"); //TO-DO
  const startDate = useMemo(() => {
    return getStartDate(range);
  }, [range]);

  const { data: transactions } = useQuery({
    queryKey: ["transactions", startDate, endDate, formatDataForCharts],
    queryFn: () => getTransactions(0, startDate, endDate, formatDataForCharts),
  });

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
