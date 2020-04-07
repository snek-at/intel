import moment, { Moment } from "moment";

interface IStreak {
  startDate?: string;
  endDate?: string | null;
  totalDays: number ;
  totalContributions: number;
}

interface IDay {
  date?: string;
  color?: string;
  total: number;
}

function calculateStreaks(values: IDay[]) {
  let list = [];
  if (!values) {
    throw new Error("An error occurred due to an invalid input parameters!");
  } else {
    let streak : IStreak = {
      totalDays: 0,
      totalContributions: 0
    };

    for (let index : number = 0; index < values.length; index++) {
      const day : IDay = values[index];
      let nextDay : IDay = {
        total: 0
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

        streak = {
          totalDays: 0,
          totalContributions: 0
        };;
      }
    }
  }
  return list;
}

export { calculateStreaks };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
