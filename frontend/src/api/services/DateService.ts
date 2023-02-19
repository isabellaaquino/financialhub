import { api } from "./Api";

class DateService {
  daysInCurrentMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
  }

  formatDayValue(day: number, minIntegerDigits: number) {
    return day.toLocaleString("en-US", {
      minimumIntegerDigits: minIntegerDigits,
      useGrouping: false,
    });
  }
}

const dateService = new DateService();
export default dateService;
