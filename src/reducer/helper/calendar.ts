//#region > Imports
//# PACKAGE "moment"
//## npm install "moment"@2.25.3
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";
//> Models
// Contains all models of the database
import * as models from "../database/models";
//> Interfaces
// Contains a calendar interface
import { ICalendar } from "../database/helper/calendar";
//#endregion

//#region > Functions
/**
 * Get a merged calendar object.
 *
 * @returns {object} A calendar object containing the current calendar structure object
 * and the calendar structure objects of all years.
 * @description Get merged contribution calendars over all platforms by year
 */
function mergedCalendar() {
  /**
   * @todo Error handling
   */
  let current = models.Calendar.getCalendar({
    from: moment().subtract(1, "years").day(0).format(),
    to: moment().format(),
  }).data;

  const { createdAt } = models.Platform.getLowestCreatedAtYear();
  let years: ICalendar[] = [];

  /**
   * @todo Error handling
   */
  for (let year = createdAt; year <= moment().year(); year++) {
    years.push(
      models.Calendar.getCalendar({
        from: moment().year(year).month(0).date(1).day(0).format(),
        to: moment().year(year).month(11).date(31).format(),
      }).data
    );
  }

  return {
    current,
    years,
  };
}
//#endregion

//#region > Exports
export { mergedCalendar };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
