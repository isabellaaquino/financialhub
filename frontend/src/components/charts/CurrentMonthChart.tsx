import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import dateService, { MONTHS_IN_YEAR } from "../../api/services/DateService";
import { SummaryOption } from "../../models/Summary";
import { Transaction, TypeOption } from "../../models/Transaction";
import { darkTheme } from "../../theme";

interface Props {
  data: Transaction[];
  option: SummaryOption;
}

function CurrentMonthChart(props: Props) {
  const [lineChartData, setLineChartData] = useState<
    { x: string; y: string | number }[]
  >([]);

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
      title: {
        text: `${
          props.option === SummaryOption.Month ? "Daily" : "Annual"
        } expenses`,
        align: "left",
        style: {
          fontFamily: "Inter",
          fontSize: "16px",
          fontWeight: "medium",
          color: "white",
        },
      },
      xaxis: {
        type: "numeric",
        labels: {
          style: {
            colors: grey[700],
          },
          show: true,
          formatter: function (value: string) {
            return String(value).substring(0, 5);
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
            // const seriesName = opts.series[opts.seriesIndex].name;
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
    let categories: string[] = [];
    const result = createLineChartData(props.option);
    result.map((transaction) => {
      categories.push(transaction.date);
    });

    const dataSet = categories.map((c) => {
      const data = result.find(({ date }) => date === c);
      return { x: c, y: data ? data.value : 0 };
    });

    setLineChartData(dataSet);
  }, [props.option, props.data]);

  useEffect(() => {
    setState((prevState) => {
      return {
        options: {
          ...prevState.options,
        },
        series: [
          {
            ...prevState.series,
            data: lineChartData,
          },
        ],
      };
    });
  }, [lineChartData]);

  function compare(
    a: {
      [id: string]: string;
    },
    b: {
      [id: string]: string;
    }
  ) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  }

  function daysInCurrentMonth() {
    //returns an array of days in current month (format: dd/MM/yyyy): [01/02/2023, 02/02/2023...]
    return Array.from(
      Array(dateService.numberOfDaysInCurrentMonth()),
      (_, i) => {
        return `${dateService.formatNumberValue(
          i + 1,
          2
        )}/${dateService.formatNumberValue(
          new Date().getMonth() + 1,
          2
        )}/${dateService.currentYear()}`;
      }
    );
  }

  function getPairValues(transactions: Transaction[], option: SummaryOption) {
    let dataSet: { [id: string]: string }[] = [];

    if (option === SummaryOption.Year) {
      //change dataSet to have only the month value instead of full date (makes it easier to reduce() the dataSet after)
      dataSet = transactions.map((x) => {
        let dict: { [id: string]: string } = {};
        dict["date"] = MONTHS_IN_YEAR[new Date(Date.parse(x.date)).getMonth()];
        dict["value"] = Number(x.value).toFixed(2);
        return dict;
      });
    } else {
      //change dataSet as dictionary {date: "dd/MM/yyyy", value: "0"}
      dataSet = transactions.map((transaction) => {
        let dict: { [id: string]: string } = {};
        dict["date"] = new Date(
          Date.parse(transaction.date)
        ).toLocaleDateString();
        dict["value"] = transaction.value.toString();
        return dict;
      });
    }

    //sum values with same months or full date (depends on option parameter)
    const map = dataSet.reduce((acc, { date, value }) => {
      let val = Number(value) + (Number(acc[date]) || 0);
      acc[date] = val.toFixed(2);
      return acc;
    }, {});

    const result = Object.entries(map).map(([key, value]) => {
      return { date: key, value: value };
    });

    if (option === SummaryOption.Year) {
      //fill the rest of months without value in database with 0
      MONTHS_IN_YEAR.forEach((date) => {
        if (!result.some((r) => r.date === date))
          result.push({ date: date, value: "0" });
      });
      return result.sort(dateService.compareMonths);
    }

    const days = daysInCurrentMonth();
    //fill the rest of days without value in database with 0
    days.forEach((date) => {
      if (!result.some((r) => r.date === date))
        result.push({ date: date, value: "0" });
    });

    return result.sort(compare);
  }

  function createLineChartData(option: SummaryOption) {
    //
    // Change transactions array into dictionary (format: {date: value}) for ApexCharts
    //
    if (option === SummaryOption.Year) return getPairValues(props.data, option);

    //if option != Summaryoption.Year, return all transactions from current month
    const transactions = props.data.filter((transaction) => {
      return (
        new Date(Date.parse(transaction.date)).getMonth() + 1 ===
          dateService.currentMonth() && transaction.type == TypeOption.EXPENSE
      );
    });
    return getPairValues(transactions, option);
  }

  return (
    <Box
      border="1px solid"
      borderColor={darkTheme.palette.background.paper}
      borderRadius={2}
      padding={3}
      height={380}
    >
      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        width="100%"
        height="100%"
      />
    </Box>
  );
}

export default CurrentMonthChart;
