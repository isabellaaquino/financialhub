import React, { Component, useState } from "react";
import Chart from "react-apexcharts";

function CurrentMonthChart() {
  const [state, setState] = useState({
    options: {
      chart: {
        toolbar: { show: false },
        id: "line",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        labels: { show: false }
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });

  return (
    <div className="CurrentMonthChart">
      <Chart
        options={state.options}
        series={state.series}
        type="line"
        width="370"

      />
    </div>
  );
}

export default CurrentMonthChart;
