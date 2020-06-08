//#region > Imports
//#PACKAGE "moment"
//## npm install "moment"@2.25.3
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";
//#endregion

//#region > Interfaces
/** @interface Streak defines the structure of a streak */
interface IStreak {
  startDate?: string;
  endDate?: string | null;
  totalDays: number;
  totalContributions: number;
}

/** @interface Day defines the structure of the calendar day */
interface IDay {
  date?: string;
  color?: string;
  total: number;
}
//#endregion

//#region > Functions
/**
 * Calculate contribution streaks.
 *
 * @function
 * @param values A list of days
 * @returns {object} A list of streaks
 * @description Determines the contribution streaks from a list of days
 */
function calculateStreaks(values: IDay[]) {
  let list = [];

  if (values) {
    let streak: IStreak = {
      totalDays: 0,
      totalContributions: 0,
    };

    for (let index: number = 0; index < values.length; index++) {
      const day: IDay = values[index];

      let nextDay: IDay = {
        total: 0,
      };

      if (values[values.length - 1] === day) {
        nextDay = values[index];
      } else {
        nextDay = values[index + 1];
      }

      if (!streak.startDate) {
        streak = {
          startDate: moment(day.date).format("YYYY-MM-DD"),
          endDate: null,
          totalDays: 0,
          totalContributions: 0,
        };
      }

      const dayDiff = moment(nextDay.date).diff(moment(day.date), "days");

      if (dayDiff === 1) {
        streak.totalDays++;
        streak.totalContributions += day.total;
      } else {
        if (streak.totalDays > 0) {
          streak.endDate = moment(day.date).format("YYYY-MM-DD");
          streak.totalContributions += day.total;
          list.push({ ...streak });
        }

        streak = {
          totalDays: 0,
          totalContributions: 0,
        };
      }
    }
  } else {
    //#ERROR
    throw new Error("An error occurred due to invalid input parameters!");
  }

  return list;
}
//#endregion

//#region > Exports
//> Functions
export { calculateStreaks };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
