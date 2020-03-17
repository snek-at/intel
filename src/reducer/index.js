//> Database Models
// Contains all database models
import * as models from "./database/models";
//> Helper
// Contains all database helper functions
import * as helper from "./helper";

//> Classes
/**
 * Providing model data using helper classes.
 */
class Reducer {
  constructor() {
    // Merging All Entries
    this.get = () => {
      return {
        profile: helper.profile.mergedProfile(),
        calendar: helper.calendar.mergedCalendar(),
        statistic: helper.statistic.mergedStatistic(),
        language: helper.language.mergedLanguage()
      };
    };
    // Get Last Added Values
    this.getRecent = () => {};
    // Merging By Source
    this.getBySource = (source) => {};
  }
}

export { Reducer, models };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
