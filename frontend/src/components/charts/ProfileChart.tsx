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
    series: [30, 40, 50],
    labels: [],
    noData: {
      text: "No data found",
    },
  });

  return (
    <div className="ProfileChart mt-10">
      <Chart
        options={state.options}
        series={state.series}
        type="donut"
        width="100%"
      />
    </div>
  );
}

export default ProfileChart;
