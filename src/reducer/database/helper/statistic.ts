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
 * Calculate all possible contribution streaks based on a list of days.
 * Streaks are defined as:
 * n continuos days with contributions above 0 --> n - 1 total streak days.
 *
 * @function
 * @param values A list of days
 * @returns {IStreak[]} A list of streaks
 */
function calculateStreaks(values: IDay[]): IStreak[] {
  const streaks: IStreak[] = [];

  let streak: IStreak | undefined = undefined;

  /**
   * Compares two days and specifies if they could be part of the same streak.
   *
   * @param {IDay} day1 A day object
   * @param {IDay} day2 A day object
   * @returns {boolean | undefined} A check whether the days could result
   *                                in a streak.
   */
  const checkContinuation = (day1: IDay, day2: IDay): boolean | undefined => {
    try {
      const dayDiff = moment(day2.date).diff(moment(day1.date), "days");

      if (dayDiff > 1) {
        return false;
      }

      return true;
    } catch {
      return undefined;
    }
  };

  /**
   * Handles a streak based on a specific day. If there isn't a streak yet, a new
   * one with default values is created.
   * When providing the isLastDay = true, totalDays are not incremented.
   *
   * @param {boolean} isLastDay A flag whether the day is the last day of the list
   * @param {IDay} day A day object
   */
  const handleStreak = (day: IDay, isLastDay: boolean = false) => {
    if (streak) {
      if (!isLastDay) {
        streak.totalDays++;
      }

      streak.totalContributions += day.total;
    } else {
      streak = {
        totalContributions: day.total,
        totalDays: 0,
        startDate: moment(day.date).format("YYYY-MM-DD"),
      };
    }
  };

  /**
   * Pushes a streak to the streak list.
   * Before pushing, endDate is set to the date of a specific day.
   * Afterwards the streak is set to undefined.
   *
   * @param lastDay A day object
   */
  const pushStreak = (lastDay: IDay) => {
    if (streak) {
      if (streak.totalDays > 0) {
        streak.endDate = moment(lastDay.date).format("YYYY-MM-DD");

        streaks.push(streak);
      }

      streak = undefined;
    }
  };

  /** Iterates through all values (days) and split them into streaks */
  for (let index: number = 0; index < values.length; index++) {
    const day = values[index];
    const nextDay = values[index + 1];
    const status = checkContinuation(day, nextDay);

    if (status) {
      handleStreak(day);
    } else if (status === undefined) {
      handleStreak(day);
      pushStreak(day);
    } else {
      pushStreak(day);
    }
  }

  return streaks;
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
