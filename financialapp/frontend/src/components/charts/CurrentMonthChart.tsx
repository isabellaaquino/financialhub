import React, { Component, useState } from "react";
import Chart from "react-apexcharts";

function CurrentMonthChart() {
  const [state, setState] = useState({
    options: {
      chart: {
        toolbar: { show: false },
        id: "bar",
      },
      xaxis: {
        categories: Array.from({ length: 30 }, (_, i) => i + 1), //1 to 30
        labels: { show: true },
      },
      yaxis: {
        labels: { show: false },
      },
      grid: {
        show: false,
      },
      dataLabels: {enabled: false}
    },
    series: [
      {
        name: "series-1",
        data: Array.from(
          { length: 30 },
          (_) => Math.floor(Math.random() * (1000 - 100) + 100) / 100
        ),
      },
    ],
  });

  return (
    <div className="CurrentMonthChart relative z-[-1]">
      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        width="1000"
        height="200"
      />
    </div>
  );
}

export default CurrentMonthChart;
