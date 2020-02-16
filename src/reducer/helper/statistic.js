import * as models from "../database/models";

function mergedStatistic() {
  // busiest day
  // streaks
  // contributions
  // createContributions

  let statistic = models.Statistic.getMerged();
  console.log(statistic)

  let response = {
    current: {},
    years: []
  };

  statistic.forEach(entry => {
    entry.contributions = entry.getContributions();
    entry.streaks = entry.getStreaks().map(streak => { return streak.render()});
    entry.busiestDay = entry.getBusiestDay();

    if(entry.busiestDay){
      entry.busiestDay = entry.busiestDay.render();
    }

    entry.render();

    if(entry.year === 0){
      response.current = entry;
    }else{
      response.years.push(entry)
    }
  })

  return response;
}

export { mergedStatistic };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
