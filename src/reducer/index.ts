//> Imports
// Contains all models of the database.
import * as models from "./database/models";
// Contains helper functions for the models.
import * as helper from "./helper";

/**@class Reduce the data of the models. */
export class Reducer{

  /**
   * Get data of the models.
   * 
   * @returns A object with profile, calendar, statistic and language information.
   * @description Get a object which contains profile, calendar, statistic and language information.
   */
  get(){
    return {
      profile: helper.profile.mergedProfile(),
      calendar: helper.calendar.mergedCalendar(),
      statistic: helper.statistic.mergedStatistic(),
      language: helper.language.mergedLanguage(),
    };
  }
}

export { models };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
