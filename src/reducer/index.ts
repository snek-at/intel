import * as models from "./database/models";
import * as helper from "./helper";

export class Reducer{
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
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
