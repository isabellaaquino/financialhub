import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface Props {
  data: { x: string; y: string | number }[];
}

function CurrentMonthChart(props: Props) {
  const [state, setState] = useState({
    options: {
      chart: {
        toolbar: { show: false },
        id: "bar",
      },
      xaxis: {
        type: "category",
        labels: {
          show: true,
          formatter: function (value: string) {
            return String(value).substring(0, 2);
          },
        },
      } as ApexXAxis,
      yaxis: {
        labels: { show: false },
      },
      grid: {
        show: false,
      },
      dataLabels: { enabled: false },
      noData: {
        text: "Loading...",
      },
    },
    series: [
      {
        name: "series-1",
        data: [],
      },
    ] as ApexAxisChartSeries,
  });

  useEffect(() => {
    setState((prevState) => {
      return {
        options: {
          ...prevState.options,
        },
        series: [
          {
            name: "Transaction",
            data: props.data,
          },
        ],
      };
    });
  }, []);

  return (
    <div className="CurrentMonthChart">
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
