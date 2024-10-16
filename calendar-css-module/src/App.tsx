import dayjs from "dayjs";
import "./App.css";
import { Calendar } from "./components/Calendar";

const data = [
  { date: "2024-10-16", event: "Meeting at 10AM" },
  { date: "2024-10-16", event: "Lunch with Sarah" },
  { date: "2024-10-17", event: "Doctor's appointment" },
];

function App() {
  const formateData = formattedGroupByDateKeyWithCache(data, "YYYY. MM. DD");

  return (
    <>
      <Calendar contents={{ values: formateData }} />
      {/* <Calendar
        render={({ currentDate, day, selectDay, selectDayHandler, size }) => (
          <CustomCell
            currentDate={currentDate}
            day={day}
            selectDay={selectDay}
            selectDayHandler={selectDayHandler}
            size={size}
          />
        )}
      /> */}
    </>
  );
}

export default App;
// function CustomCell({
//   currentDate,
//   selectDay,
//   selectDayHandler,
//   day,
//   size,
// }: {
//   currentDate: Dayjs;
//   selectDay: Dayjs | null;
//   selectDayHandler: (day: Dayjs) => void;
//   day: Dayjs;
//   size: "sm" | "lg";
// }) {
//   console.log(currentDate, selectDay, selectDayHandler, day, size);
//   return <div></div>;
// }

function formattedGroupByDateKeyWithCache<T extends { date: string }>(
  array: T[],
  format: string,
): Map<dayjs.FormatObject["format"], T[]> {
  return array.reduce((acc, cur) => {
    const dateKey = dayjs(cur.date).format(format);
    if (acc.has(dateKey)) {
      acc.get(dateKey)?.push(cur);
    } else {
      acc.set(dateKey, [cur]);
    }
    return acc;
  }, new Map<dayjs.FormatObject["format"], T[]>());
}
