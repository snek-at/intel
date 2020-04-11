//> Imports
// Contains all models of the database.
import * as models from "../database/models";

export interface IStatisticResponse {
  current: IStatistic | null;
  years: IStatistic[];
}

export interface IStatistic extends models.Statistic {
  busiestDay: models.Calendar;
  contributions: {
    commit: number;
    issue: number;
    pullRequest: number;
    pullRequestReview: number;
  }
  streak: {
    longest: models.Streak;
    current: models.Streak;
    streaks: models.Streak[];
  }
}

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
    entry.contributions = entry.getContributions();
    let streaks = entry.getStreaks().map((streak: any) => {
      return streak.render();
    });
    let { longest, current } = entry.getStreakDetail(streaks);
    entry.streak = {
      longest,
      current,
      streaks,
    };
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

export { mergedStatistic };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
