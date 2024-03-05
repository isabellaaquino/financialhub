import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ApexOptions } from "apexcharts";
import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { AggregatedExpense } from "../../models/Transaction";
import { darkTheme } from "../../theme";

interface Props {
  data: AggregatedExpense[];
}

function ProfileChart(props: Props) {
  const colors = props.data.map((obj) => obj.label_color);
  const amounts = props.data.map((obj) => obj.total_amount);
  const labels = props.data.map((obj) => obj.label_name);

  const state = useMemo(() => {
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
        title: {
          text: "Profile distribution",
          align: "left",
          style: {
            fontFamily: "Inter",
            fontSize: "16px",
            fontWeight: "medium",
            color: "white",
          },
        } as ApexTitleSubtitle,
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
    } as {
      series: ApexAxisChartSeries | ApexNonAxisChartSeries;
      options: ApexOptions;
    };
  }, [props.data]);
  return (
    <Box
      border="1px solid"
      borderColor={darkTheme.palette.background.paper}
      borderRadius={2}
      padding={3}
      height={380}
    >
      {props.data.length === 0 ? (
        <Typography
          component="p"
          variant="body1"
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 19,
            textAlign: "center",
          }}
        >
          Unable to load chart due to insufficient data.
        </Typography>
      ) : (
        <Chart
          options={state.options}
          series={state.series}
          type="pie"
          width="100%"
          height="100%"
        />
      )}
    </Box>
  );
}

export default ProfileChart;
