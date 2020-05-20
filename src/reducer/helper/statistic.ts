//#region > Imports
//> Models
// Contains all models of the database
import * as models from "../database/models";
//> Helper
// Contains all calendar helper functions
import * as helper from "./index";
//> Delay
// Contains a Delay function for timeouts
import Delay from "../../toolbox/Delay";
//> Interfaces
//> Contains the share interface for the languages
import { Share } from "../database/osm/models";
// Contains the contribution calendar structure
import { ICalendar } from "../database/helper/calendar";
//#endregion

//#region > Interfaces
/**
 * @interface StatisticResponse defines the structure of the merged statistic
 *                              response object.
 */
interface IStatisticResponse {
  /**
   * Current: The current statistic year object.
   *          This can be null if there is no current year in the database.
   */
  current: IStatistic | null;
  /**
   * Years: A list of statistic year objects.
   */
  years: IStatistic[];
  /**
   * Languages: A list of language objects.
   */
  languages: models.Language[];
}

/** @interface Statistic defines the structure of statistic object */
interface IStatistic extends models.Statistic {
  /**
   * BustiestDay: A calendar day object.
   */
  busiestDay: models.Calendar;
  /**
   * Contributions: A object with contribution types and their total.
   */
  contributions: {
    /**
     *  Commit: The share of commit contributions.
     */
    commit: Share;
    /**
     *  Issue: The share of issue contributions.
     */
    issue: Share;
    /**
     *  PullRequest: The share of pullRequest contributions.
     */
    pullRequest: Share;
    /**
     *  PullRequestReview: The share of pullRequestReview contributions.
     */
    pullRequestReview: Share;
    /**
     * Total: The total amount of contributions. This is the sum of all
     *        contribution type share object total fields.
     */
    total: number;
  };
  /**
   * Streaks: A object which contains longest, current and a list of streaks.
   */
  streak: {
    /**
     * Longest: The streak with the longest difference between
     *          startDate and endDate.
     */
    longest: models.Streak;
    /**
     *  Current: A streak which ends today.
     */
    current: models.Streak;
    /**
     *  Streaks: A list of streak objects.
     */
    streaks: models.Streak[];
  };
  /**
   * Calendar: A contribution calendar in day format.
   */
  calendar: ICalendar;
}
//#endregion

//#region > Functions
/**
 * A merged statistic.
 *
 * @function
 * @returns A statistic object
 * @description Returns a object containing e.g busiest day and streaks of the
 *              current and each year.
 */
async function mergedStatistic(): Promise<IStatisticResponse> {
  let statistic = models.Statistic.getMerged() as IStatistic[];

  let currentYear: IStatistic | null = null;
  let yearsList: IStatistic[] = [];

  /* Get merged calendar which contains the current and a list of years */
  let calendar = helper.calendar.mergedCalendar();

  for (const index in statistic) {
    await Delay(300);

    let entry = statistic[index];
    let streaks = entry.getStreaks().map((streak) => {
      return streak.render([]);
    });

    let { longest, current } = entry.getStreakDetail(streaks);

    entry.streak = {
      longest,
      current,
      streaks,
    };
    entry.contributions = entry.getContributions();
    entry.busiestDay = entry.getBusiestDay();

    if (entry.busiestDay) {
      entry.busiestDay = entry.busiestDay.render([]);
    }

    entry.render([]);

    if (entry.year === 0) {
      /* Integrate a calendar year to the current statistic year */
      entry.calendar = calendar.current;
      currentYear = entry;
    } else {
      /* Integrate a calendar year to the corresponding statistic year */
      entry.calendar = calendar.years[yearsList.length];

      yearsList.push(entry);
    }
  }

  await Delay(2500);

  /* Get the merged languages which contains a list of language object */
  const languages = helper.language.mergedLanguage();

  return { current: currentYear, years: yearsList, languages };
}
//#endregion

//#region > Exports
export type { IStatisticResponse, IStatistic };
export { mergedStatistic };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
