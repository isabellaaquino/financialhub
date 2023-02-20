export const MONTHS_IN_YEAR = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
class DateService {
  numberOfDaysInCurrentMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  formatNumberValue(day: number, minIntegerDigits: number) {
    return day.toLocaleString("en-US", {
      minimumIntegerDigits: minIntegerDigits,
      useGrouping: false,
    });
  }

  removeFormatNumberValue(numberFormatted: string) {
    return Number(numberFormatted);
  }

  formatDateValue(dateString: string) {
    const date = new Date(Date.parse(dateString));
    return `${this.formatNumberValue(
      date.getDay() + 1,
      2
    )}/${this.formatNumberValue(date.getMonth() + 1, 2)}/${date.getFullYear()}`;
  }

  currentMonth() {
    return new Date().getMonth() + 1;
  }

  currentYear() {
    return new Date().getFullYear();
  }

  compareMonths(
    a: {
      [id: string]: string;
    },
    b: {
      [id: string]: string;
    }
  ) {
    if (MONTHS_IN_YEAR.indexOf(a.date) < MONTHS_IN_YEAR.indexOf(b.date)) {
      return -1;
    }
    if (MONTHS_IN_YEAR.indexOf(a.date) > MONTHS_IN_YEAR.indexOf(b.date)) {
      return 1;
    }
    return 0;
  }
}

const dateService = new DateService();
export default dateService;
