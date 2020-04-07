import moment from "moment";

// interface ICalendar {
//   [index:number]: IDay[];
// }

export interface ICalendar {
  weeks: { days: IDay[] }[];
}

interface IDay {
  date: string;
  color: string;
  total: number;
}

function generateCalendarStructure(startDate: string, endDate: string) {
  let days: IDay[] = [];
  let weeks = [
    {
      days
    }
  ];

  for (
    var m = moment(startDate);
    m.diff(endDate, "days") <= 0;
    m.add(1, "days")
  ) {
    if (weeks[weeks.length - 1].days.length > 6) {
      weeks.push({
        days: []
      });
    }
    let day: IDay = { date: m.format("YYYY-MM-DD"), color: "#ffffff", total: 0 }
    weeks[weeks.length - 1].days.push(day);
  }

  let calendar = <ICalendar>{ weeks };
  return calendar;
}

function fillCalendarWithColors(calendar: ICalendar, busiestDayTotal: number) {
  calendar.weeks.forEach((week) => {
    week.days.forEach((day) => {
      let precision = day.total / busiestDayTotal;
      if (precision > 0.8 && precision <= 1) {
        day.color = "#196127";
      } else if (precision > 0.6 && precision <= 0.8) {
        day.color = "#239a3b";
      } else if (precision > 0.4 && precision <= 0.6) {
        day.color = "#7bc96f";
      } else if (precision > 0.0 && precision <= 0.4) {
        day.color = "#c6e48b";
      } else if (precision === 0) {
        day.color = "#ebedf0";
      }
    });
  });

  return calendar;
}

export { generateCalendarStructure, fillCalendarWithColors };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */