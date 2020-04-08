//> Imports
// Contains all models of the database.
import * as models from "../database/models";

/**
 * A merged statistic.
 * 
 * @returns A statistic object.
 * @description Returns a object containing e.g busiest day and streaks of current and each year.
 */
function mergedStatistic() {
  let statistic = models.Statistic.getMerged();

  let yearsList : any[] = []
  let response = {
    current: {},
    years: yearsList
  };

  statistic.forEach((entry:any) => {
    entry.contributions = entry.getContributions();
    let streaks = entry.getStreaks().map((streak:any) => {
      return streak.render();
    });
    let { longest, current } = entry.getStreakDetail(streaks);
    entry.streak = {
      longest,
      current,
      streaks
    };
    entry.busiestDay = entry.getBusiestDay();

    if (entry.busiestDay) {
      entry.busiestDay = entry.busiestDay.render();
    }

    entry.render();

    if (entry.year === 0) {
      response.current = entry;
    } else {
      response.years.push(entry);
    }
  });

  return response;
}

export { mergedStatistic };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
