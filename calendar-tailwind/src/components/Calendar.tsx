import React, { MouseEvent, ReactNode, useCallback, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
type CalendarTailwinds<T = string> = {
  /**sm size */
  readonly sm_nav_row: T; // <nav/>
  readonly sm_nav_button_grid: T; // <div/>
  readonly sm_nav_button: T; // <button/>
  readonly sm_nav_button_svg: T; // <svg/>
  readonly sm_nav_button_path: T; //<path/>
  // headCompo
  readonly sm_days_row: T; //<header/>
  readonly sm_days_content: T; //<span/>
  // TableCompo
  readonly sm_table: T; // <ul/>
  // cell
  readonly sm_cell: T; // <li/>
  readonly sm_cell_button: T; // <button/>
  readonly sm_cell_value: T; // <p/>
  // cell conditional css
  readonly sm_cell_isSameMonth: T; // sm_cell Styling
  readonly sm_cell_isSelectDay: T;
  readonly sm_cell_isToday: T;

  /**lg size */
  readonly lg_nav_row: T; //<nav/>
  readonly lg_nav_button_grid: T; // <div/>
  readonly lg_nav_button: T; // <button/>
  readonly lg_nav_button_svg: T; // <svg/>
  readonly lg_nav_button_path: T; //<path/>
  // headCompo
  readonly lg_days_row: T; //<header/>
  readonly lg_days_content: T; //<span/>
  // TableCompo
  readonly lg_table: T; //<ul/>
  // cell
  readonly lg_cell: T; // <li/>
  readonly lg_cell_button: T; // <button/>
  readonly lg_cell_value: T; // <p/>
  // cell conditional css
  readonly lg_cell_isSameMonth: T; // lg_cell Styling
  readonly lg_cell_isSelectDay: T; // lg_cell Styling
  readonly lg_cell_isToday: T; // lg_cell Styling
};
type ClassNames = Partial<CalendarTailwinds>;

const DAYS = [0, 1, 2, 3, 4, 5, 6];
const svgCVA = cva("fill-none", {
  variants: {
    svg: {
      sm: "w-5 h-5",
      lg: "w-9 h-9",
    },
    path: {
      sm: "stroke-[#5C5C5C] stroke-2 group-hover:stroke-white",
      lg: "stroke-black stroke-[3]",
    },
  },
});
const buttonCVA = cva(
  "p-0 m-0 bg-transparent border-none outline-none appearance-none  focus:outline-none cursor-pointer",
  {
    variants: {
      nav: {
        sm: "flex w-7 justify-center items-center rounded-lg hover:bg-neutral-900 transition-colors duration-500 group",
        lg: "w-14 h-14 rounded-[12px] opacity-50 bg-gray-300 hover:transition-opacity hover:duration-500 hover:opacity-100 flex justify-center items-center",
      },
      cell: {
        sm: "",
        lg: "text-sm",
      },
    },
  },
);
const CalendarCVA = cva("", {
  variants: {
    size: {
      sm: "grid grid-cols-[max-content] w-[max-content] gap-y-3 p-4 bg-black grid-rows-[1fr_1fr_auto] rounded-xl border-2 border-[#bbb] text-white",
      lg: "grid grid-rows-[1fr_auto_auto] grid-cols-[max-content] w-[max-content] bg-black border-[#bbb] text-white p-6 rounded-2xl border-4",
    },
    nav: {
      sm: "flex justify-center relative",
      lg: "flex flex-col items-start text-2xl",
    },
    nav_button_container: {
      sm: "absolute inset-0 flex justify-between",
      lg: "mt-4 flex gap-2 pb-2 border-b border-gray-300",
    },

    header: {
      sm: "grid grid-cols-7 place-content-center gap-x-[10px] justify-items-center text-xs font-bold text-[#A1A1AA]",
      lg: "mt-6 grid auto-rows-auto grid-cols-7 justify-items-start gap-6 text-lg",
    },
    table: {
      sm: "grid grid-cols-7 gap-y-[14px] gap-x-[10px] text-sm",
      lg: "mt-6 grid grid-cols-7 justify-items-start gap-x-6 gap-y-[14px]",
    },
  },
});

const CellCVA = cva("", {
  variants: {
    cell: {
      sm: "relative flex justify-center w-8 h-8 rounded-[10px] opacity-50 cursor-pointer hover:transition-colors hover:duration-[0.3s] hover:bg-neutral-900 hover:text-[#bbb]",
      lg: "flex flex-col gap-2 w-[76px] h-[76px] items-start cursor-pointer opacity-50 p-1 rounded-xl hover:transition-opacity hover:duration-[0.2s] hover:opacity-70 hover:text-white hover:bg-[#404045]",
    },
    isSameMonth: {
      true: "",
    },
    isSelectDay: {
      true: "",
    },
    isToday: {
      true: "",
    },
    cell_value: {
      sm: "w-0 overflow-hidden after:content-[''] after:absolute after:top-1 after:right-1 after:w-1 after:h-1 after:rounded-full after:bg-[#ff6600]",
      lg: "w-full h-full text-sm pl-1 overflow-hidden text-start text-ellipsis whitespace-nowrap",
    },
  },
  compoundVariants: [
    {
      cell: "sm",
      isSameMonth: true,
      className: "opacity-100",
    },
    {
      cell: "sm",
      isSelectDay: true,
      className:
        "bg-white text-black hover:transition-none hover:bg-white hover:text-black",
    },
    {
      cell: "sm",
      isToday: true,
      className: "bg-[#27272A]",
    },
    {
      cell: "lg",
      isToday: true,
      className: "bg-[#27272A] opacity-100",
    },
    {
      cell: "lg",
      isSelectDay: true,
      className:
        "bg-white text-black opacity-100 font-bold hover:bg-white hover:text-black hover:opacity-100",
    },
  ],
});

const Calendar = <T extends { [key: string | number]: ReactNode }>({
  defaultDate,
  defaultSetDate,
  defaultSelectDate,
  defaultSetSelectDate,
  onClickHandler,
  classNames,
  className,
  size = "sm",
  render,
  contents,
  identiFormat = "YYYY. MM. DD", // 기본 포맷 제공
  cellDateFormat = "D", // 기본 날짜 렌더링 포맷
}: {
  className?: string;
  classNames?: ClassNames;
  defaultDate?: Dayjs;
  size?: "sm" | "lg";
  contents?: {
    values: Map<dayjs.FormatObject["format"], T[]>;
    format?: string;
  };
  defaultSetDate?: React.Dispatch<React.SetStateAction<Dayjs>>;
  defaultSetSelectDate?: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  defaultSelectDate?: Dayjs | null;
  onClickHandler?: (
    values: Map<dayjs.FormatObject["format"], T[]>,
    key: dayjs.FormatObject["format"],
  ) => void;
  identiFormat?: string;
  cellDateFormat?: string;
  render?: (props: {
    currentDate: Dayjs;
    selectDay: Dayjs | null;
    day: Dayjs;
    value?: T[];
    size: "sm" | "lg";
    cellDateFormat: string;
    itemKey: string;
  }) => JSX.Element;
}) => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(defaultDate ?? dayjs());
  const [selectDay, setSelectDay] = useState<Dayjs | null>(
    defaultSelectDate ?? null,
  );
  const setUpdateDate = defaultSetDate ?? setCurrentDate;
  const setUpdateSelectDate = defaultSetSelectDate ?? setSelectDay;

  const clickPreMonthHandler = useCallback(() => {
    setUpdateDate(currentDate.subtract(1, "month"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const clickNextMonthHandler = useCallback(() => {
    setUpdateDate(currentDate.add(1, "month"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const defaultOnClickHandler = (
    values: Map<dayjs.FormatObject["format"], T[]>,
    key: dayjs.FormatObject["format"],
  ) => {
    if (!values) return;
    const value = values.get(key);
    // Please watching console
    console.log("value : ", value);
  };
  const onClickDayHandler = onClickHandler ?? defaultOnClickHandler;
  const onChangeSelectDay = useCallback(
    (day: Dayjs) => {
      setUpdateSelectDate(selectDay?.isSame(day, "d") ? null : day);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectDay],
  );

  return (
    <div className={cn(CalendarCVA({ size }), className)}>
      <NavCompo
        classNames={classNames}
        size={size}
        currentDate={currentDate}
        clickPreMonthHandler={clickPreMonthHandler}
        clickNextMonthHandler={clickNextMonthHandler}
      />
      <HeadCompo classNames={classNames} size={size} />
      <TableCompo
        classNames={classNames}
        contents={contents}
        size={size}
        currentDate={currentDate}
        selectDay={selectDay}
        onClickDayHandler={onClickDayHandler}
        onChangeSelectDay={onChangeSelectDay}
        render={render}
        identiFormat={identiFormat}
        cellDateFormat={cellDateFormat}
      />
    </div>
  );
};

function NavCompo({
  currentDate,
  clickPreMonthHandler,
  clickNextMonthHandler,
  classNames,
  size,
}: {
  currentDate: Dayjs;
  classNames?: ClassNames;
  clickPreMonthHandler: () => void;
  clickNextMonthHandler: () => void;
  size: "sm" | "lg";
}) {
  return (
    // nav row
    <nav
      className={cn(
        CalendarCVA({ nav: size }),
        classNames?.[`${size}_nav_row`],
      )}
    >
      {currentDate.format("MMMM YYYY")}
      {/**nav_button_grid */}
      <div
        className={cn(
          CalendarCVA({ nav_button_container: size }),
          classNames?.[`${size}_nav_button_grid`],
        )}
      >
        {/* nav_button & nav_button_previous */}
        <button
          className={cn(
            buttonCVA({ nav: size }),
            classNames?.[`${size}_nav_button`],
          )}
          type="button"
          onClick={clickPreMonthHandler}
        >
          {/* nav_button_svg */}
          <ArrowLeft classNames={classNames} size={size} />
        </button>
        {/* nav_button & nav_button_next */}
        <button
          className={cn(
            buttonCVA({ nav: size }),
            classNames?.[`${size}_nav_button`],
          )}
          type="button"
          onClick={clickNextMonthHandler}
        >
          {/* nav_button_svg */}
          <ArrowRight classNames={classNames} size={size} />
        </button>
      </div>
    </nav>
  );
}

const HeadCompo = React.memo(function Days({
  size,
  classNames,
}: {
  size: "sm" | "lg";
  classNames?: ClassNames;
}) {
  return (
    <header
      className={cn(
        CalendarCVA({ header: size }),
        classNames?.[`${size}_days_row`],
      )}
    >
      {DAYS.map((day) => (
        <span key={day} className={cn(classNames?.[`${size}_days_content`])}>
          {dayjs()
            .day(day)
            .format(size === "sm" ? "dd" : "ddd")}
        </span>
      ))}
    </header>
  );
});

function TableCompo<T extends { [key: string | number]: ReactNode }>({
  currentDate,
  selectDay,
  size,
  onChangeSelectDay,
  contents,
  onClickDayHandler,
  render,
  identiFormat,
  cellDateFormat,
  classNames,
}: {
  currentDate: Dayjs;
  size: "sm" | "lg";
  classNames?: ClassNames;
  selectDay: Dayjs | null;
  onChangeSelectDay: (day: Dayjs) => void;
  onClickDayHandler: (
    values: Map<dayjs.FormatObject["format"], T[]>,
    key: dayjs.FormatObject["format"],
  ) => void;
  contents?: {
    values: Map<dayjs.FormatObject["format"], T[]>;
    format?: string;
  };
  render?: (props: {
    currentDate: Dayjs;
    selectDay: Dayjs | null;
    day: Dayjs;
    value?: T[];
    size: "sm" | "lg";
    cellDateFormat: string;
    itemKey: string;
  }) => JSX.Element;

  identiFormat: string;
  cellDateFormat: string;
}) {
  const startDay = currentDate.startOf("month").startOf("week");
  const endDay = currentDate.endOf("month").endOf("week");
  const today = dayjs();
  const dates: JSX.Element[] = [];
  let day = startDay;

  while (day <= endDay) {
    for (let i = 0; i < 7; i++) {
      const itemKey = day.format(contents?.format ?? identiFormat);
      const isToday = day.isSame(today, "D");
      const isSameMonth = day.isSame(currentDate, "month");
      const value = contents?.values?.get(itemKey as string) || [];

      dates.push(
        render ? (
          render({
            currentDate,
            selectDay,
            day,
            size,
            value,
            cellDateFormat,
            itemKey,
          })
        ) : (
          <li
            data-id={itemKey}
            key={`${itemKey}-${i}`}
            className={cn(
              CellCVA({
                cell: size,
                isSameMonth: isSameMonth,
                isSelectDay: selectDay?.isSame(day, "day"),
                isToday: isToday,
              }),

              isSameMonth && classNames?.[`${size}_cell_isSameMonth`],
              selectDay?.isSame(day, "day") &&
                classNames?.[`${size}_cell_isSelectDay`],
              isToday && classNames?.[`${size}_cell_isToday`],
            )}
          >
            <button
              type="button"
              className={cn(
                buttonCVA({ cell: size }),
                classNames?.[`${size}_cell_button`],
              )}
            >
              {day.format(cellDateFormat)}
            </button>

            {value.length > 0 && (
              <p
                className={cn(
                  CellCVA({ cell_value: size }),
                  classNames?.[`${size}_cell_value`],
                )}
              >
                {value.map((val) =>
                  Object.entries(val).map(([key, value]) => (
                    <React.Fragment key={`${key}+${value}`}>
                      {key} : {value}
                      <br />
                    </React.Fragment>
                  )),
                )}
              </p>
            )}
          </li>
        ),
      );
      day = day.add(1, "day");
    }
  }

  return (
    <ul
      className={cn(
        CalendarCVA({ table: size }),
        classNames?.[`${size}_table`],
      )}
      onClick={(e: MouseEvent<HTMLUListElement>) => {
        const target = e.target as HTMLElement;
        if (target instanceof HTMLUListElement) return;

        const targetLi = target.closest("li");
        if (!targetLi) return;
        const parsedDay = dayjs(
          targetLi.dataset.id,
          contents?.format ?? identiFormat,
        );
        onChangeSelectDay(parsedDay);

        if (
          !contents?.values ||
          !contents.values.get(
            parsedDay.format(contents?.format ?? identiFormat),
          )
        )
          return;

        onClickDayHandler(
          contents?.values,
          parsedDay.format(contents?.format ?? identiFormat),
        );
      }}
    >
      {dates}
    </ul>
  );
}

const ArrowLeft = React.memo(function ArrowLeft({
  size,
  classNames,
}: {
  size: "sm" | "lg";
  classNames?: ClassNames;
}) {
  return (
    <svg
      className={cn(
        svgCVA({ svg: size }),
        classNames?.[`${size}_nav_button_svg`],
      )}
      viewBox="0 0 35 35"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="arrow-left">
        <path
          id="Vector"
          d="M21.5 25.5L13.5 18L21.5 10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            svgCVA({ path: size }),
            classNames?.[`${size}_nav_button_path`],
          )}
        />
      </g>
    </svg>
  );
});

const ArrowRight = React.memo(function ArrowRight({
  size,
  classNames,
}: {
  size: "sm" | "lg";
  classNames?: ClassNames;
}) {
  return (
    <svg
      className={cn(
        svgCVA({ svg: size }),
        classNames?.[`${size}_nav_button_svg`],
      )}
      viewBox="0 0 35 35"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="arrow-right">
        <path
          id="Vector"
          d="M13.5 25.5L21.5 18L13.5 10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            svgCVA({ path: size }),
            classNames?.[`${size}_nav_button_path`],
          )}
        />
      </g>
    </svg>
  );
});

export { Calendar };
