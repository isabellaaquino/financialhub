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
import { useTransactions } from "../../hooks/useTransactions";
import { AggregatedExpense } from "../../models/Transaction";
import { darkTheme } from "../../theme";
import { getStartDate, rangeOptionMask } from "../../utils/utils";

interface Props {
  data: AggregatedExpense[];
}

export enum RangeOptions {
  LastWeek = 0,
  LastTwoWeeks = 1,
  LastMonth = 2,
}

function ProfileChart(props: Props) {
  const { data } = props;
  const { getTransactions } = useTransactions();

  const colors = data.map((obj) => obj.label_color);
  const amounts = data.map((obj) => obj.total_amount);
  const labels = data.map((obj) => obj.label_name);

  const [range, setRange] = useState<RangeOptions>(RangeOptions.LastMonth);

  const endDate = new Date(new Date()); //TO-DO
  const startDate = useMemo(() => {
    return getStartDate(range);
  }, [range]);

  const { data: transactions } = useQuery({
    queryKey: ["transactions", startDate],
    queryFn: () => getTransactions(0, startDate, endDate, true),
  });

  const [state, setState] = useState<{
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    options: ApexOptions;
  }>({
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
  });

  useEffect(() => {
    setState({ series: amounts, options: { labels: labels, colors: colors } });
  }, [props.data]);

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
          alignItems: "left",
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
        type="pie"
        width="100%"
        height="100%"
      />
    </Box>
  );
}

export default ProfileChart;
