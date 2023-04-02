import { ApexOptions } from "apexcharts";
import React, { Component, useState } from "react";
import Chart from "react-apexcharts";

function ProfileChart() {
  var legend: ApexLegend = {
    show: false,
    position: "bottom",
  };

  const [state, setState] = useState({
    options: {
      chart: {
        toolbar: { show: false },
        id: "donut",
      },
      dataLabels: {
        enabled: false,
      },
      legend: legend,
    },
    series: [],
    labels: [],
    noData: {
      text: "No data found",
    },
  });

  return (
    <div className="ProfileChart">
      <Chart
        options={state.options}
        series={state.series}
        type="donut"
        width="370"
      />
    </div>
  );
}

export default ProfileChart;
