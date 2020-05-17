//#region > Imports
//> Models
// Contains all models of the database.
import * as models from "./database/models";
// Contains the osm functions
import * as osm from "./database/osm";
//> Helper
// Contains helper functions for the models.
import * as helper from "./helper";
//#endregion

//#region > Classes
/** @class Reduce the data of the models */
class Reducer {
  //> Static Fields
  static models = models;

  //> Methods
  /**
   * Get data of the models.
   *
   * @returns {object} A object with profile, calendar, statistic and
   *                   language information.
   * @description Get a object which contains profile, calendar, statistic and
   *              language information.
   */
  async get() {
    return {
      profile: await helper.profile.mergedProfile(),
      statistic: await helper.statistic.mergedStatistic(),
    };
  }

  /**
   * @returns {Promise<helper.talks.ITalk[]>} A promise which contains a object
   *                                          list with talk information.
   * @description Delivers all talks from the database
   */
  async getTalks() : Promise<helper.talks.ITalk[]> {
    return helper.talks.mergedTalks();
  }

  /**
   * Reset the database.
   * @description Resets the database by emptying all tables
   */
  reset() {
    osm.reset();
  }
}
//#endregion

//#region > Exports
export { Reducer };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
