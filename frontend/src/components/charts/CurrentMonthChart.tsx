import React, { Component, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import dateService from "../../api/services/DateService";
import { Transaction } from "../../api/services/TransactionService";
import { ApexOptions } from "apexcharts";

interface Props {
  data: { [id: string]: string }[];
}

function CurrentMonthChart(props: Props) {
  let [daysInMonth, setDaysInMonth] = useState<number>(
    dateService.daysInCurrentMonth()
  );
  let [currentMonth, setCurrentMonth] = useState<string>(
    dateService.formatDayValue(new Date().getMonth() + 1, 2)
  );
  let [categories, setCategories] = useState<string[]>([]);
  let [series, setSeries] = useState<number[]>([]);
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
    let categories: string[] = [];
    let series: number[] = [];
    props.data.map((transaction) => {
      categories.push(transaction.date);
      series.push(Number(transaction.value));
    });

    categories = Array.from(Array(daysInMonth).keys()).map((day) => {
      return `${dateService.formatDayValue(
        day + 1,
        2
      )}/${currentMonth}/${new Date().getFullYear()}`;
    });

    setCategories(categories);
    setSeries(series);
  }, []);

  useEffect(() => {
    setState((prevState) => {
      return {
        ...prevState,
        series: [
          {
            name: "series-1",
            data: getPairedValues(),
          },
        ],
      };
    });
  }, [categories, series]);

  function getPairedValues() {
    props.data.forEach(({ date, value }) => {
      let categoryIndex = categories.findIndex((c) => c === date);
    });

    // return Object.fromEntries(
    //   categories.map((c) => {
    //     const dataSet = props.data.find(({ date, value }) => date === c);
    //     return [c, dataSet ? dataSet.value : 0];
    //   })
    // );
    return categories.map((c) => {
      const dataSet = props.data.find(({ date, value }) => date === c);
      return { x: c, y: dataSet ? dataSet.value : 0 };
    });
  }

  return (
    <div className="CurrentMonthChart">
      {state && (
        <Chart
          options={state.options}
          series={state.series}
          type="bar"
          width="1000"
          height="200"
        />
      )}
    </div>
  );
}

export default CurrentMonthChart;
