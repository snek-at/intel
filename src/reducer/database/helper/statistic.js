import moment from "moment";

/**
 *  Calculating streaks based on a list of calendar days.
 */
function calculateStreaks(values) {
  let list = [];

  if (values) {
    let streak = {};

    for (let index = 0; index < values.length; index++) {
      const day = values[parseInt(index)];
      let nextDay = {};

      if (values[values.length - 1] === day) {
        nextDay = values[parseInt(index)];
      } else {
        nextDay = values[parseInt(index) + 1];
      }

      if (!streak.startDate) {
        streak = {
          startDate: moment(day.date).format("YYYY-MM-DD"),
          endDate: null,
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
  }
  return list;
}

export { calculateStreaks };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
