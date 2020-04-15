//#region > Imports
//> Models
// Contains all models of the database.
import * as models from "../database/models";
//#endregion

//#region > Interfaces
/** @interface StatisticResponse defines the structure of the merged statistic response object. */
interface IStatisticResponse {
  /**
   * Current: The current statistic year object. This can be null if there is no current year in the database.
   */
  current: IStatistic | null;
  /**
   * Years: A list of statistic year objects.
   */
  years: IStatistic[];
}

/** @interface Statistic defines the structure of statistic object. */
interface IStatistic extends models.Statistic {
  /**
   * BustiestDay: A calendar day object.
   */
  busiestDay: models.Calendar;
  /**
   * Contributions: A object with contribution types and their total.
   */
  contributions: {
    commit: number;
    issue: number;
    pullRequest: number;
    pullRequestReview: number;
  }
  /**
   * Streaks: A object which contains longest, current and a list of streaks. 
   */
  streak: {
    longest: models.Streak;
    current: models.Streak;
    streaks: models.Streak[];
  }
}
//#endregion

//#region > Functions
/**
 * A merged statistic.
 *
 * @returns A statistic object.
 * @description Returns a object containing e.g busiest day and streaks of current and each year.
 */
function mergedStatistic() : IStatisticResponse {
  let statistic = models.Statistic.getMerged() as IStatistic[];
  
  let currentYear: IStatistic | null = null;
  let yearsList: IStatistic[] = [];

  statistic.forEach((entry) => {
    let streaks = entry.getStreaks().map((streak) => {
      return streak.render([]);
    });

    let { longest, current } = entry.getStreakDetail(streaks);

    entry.streak = {
      longest,
      current,
      streaks
    };
    entry.contributions = entry.getContributions();
    entry.busiestDay = entry.getBusiestDay();

    if (entry.busiestDay) {
      entry.busiestDay = entry.busiestDay.render([]);
    }

    entry.render([]);

    if (entry.year === 0) {
      currentYear = entry;
    } else {
      yearsList.push(entry);
    }
  });

  return {current: currentYear, years: yearsList};
}
//#endregion

//#region > Exports
export type { IStatisticResponse, IStatistic }
export { mergedStatistic };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
