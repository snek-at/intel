//> Moment
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";

/**
 * Generating a raw calendar structure by start end end dates.
 * No colors or totals are being filled.
 */
function generateCalendarStructure(startDate, endDate) {
  let weeks = [
    {
      days: []
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

    weeks[weeks.length - 1].days.push({
      date: m.format("YYYY-MM-DD")
    });
  }

  return {
    weeks
  };
}

/**
 * Fill calendar structure with the correct colors
 * based on the busiest day. The calendar structure
 * must be already filled with totals.
 */
function fillCalendarWithColors(calendar, busiestDay) {
  calendar.weeks.forEach((week) => {
    week.days.forEach((day) => {
      let precision = day.total / busiestDay;

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
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
