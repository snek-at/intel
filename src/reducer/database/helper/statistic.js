import moment from "moment";

function calculateStreaks(values) {
  if (values === undefined) {
    throw new Error("An error occurred due to an invalid input parameters!");
  }

  let list = [];
  let streak = {};

  for (let index = 0; index < values.length; index++) {
    const day = values[index];
    const nextDay = {};
    if (values[values.length - 1] === day) {
      nextDay = values[index];
    } else {
      nextDay = values[index + 1];
    }

    if (!streak.startDate) {
      streak = {
        startDate: moment(day.date).format("YYYY-MM-DD"),
        endDate: undefined,
        totalDays: 0,
        totalContributions: 0
      };
    }
    const dayDiff = moment(nextDay.date).diff(moment(day.date), "days");
    if (dayDiff === 1) {
      streak.totalDays += 1;
      streak.totalContributions += day.total;
    } else {
      if (streak.totalDays > 0) {
        streak.endDate = moment(day.date).format("YYYY-MM-DD");
        streak.totalContributions += day.total;
        list.push({ ...streak });
      }

      streak = {};
    }
  }
  return list;
}

export { calculateStreaks };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
