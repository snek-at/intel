//#region > Imports
//> Models
// Contains all models of the database.
import * as models from "./database/models";
//> Helper
// Contains helper functions for the models.
import * as helper from "./helper";
//#endregion

//#region > Classes
/** @class Reduce the data of the models. */
class Reducer {
  /**
   * Get data of the models.
   *
   * @returns {object} A object with profile, calendar, statistic and language information.
   * @description Get a object which contains profile, calendar, statistic and language information.
   */
  get() {
    return {
      profile: helper.profile.mergedProfile(),
      calendar: helper.calendar.mergedCalendar(),
      statistic: helper.statistic.mergedStatistic(),
      language: helper.language.mergedLanguage()
    };
  }
}
//#endregion

//#region > Exports
export { Reducer, models };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
