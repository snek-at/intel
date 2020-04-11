//> Imports
// Contains all models of the database.
import * as models from "../database/models";
// Contains a lightweight framework for time management.
import moment from "moment";

/**
 * Get a merged calendar.
 *
 * @retruns The calendar of the current and all years.
 * @description Get merged contribution calendears over all platforms by year.
 */
function mergedCalendar() {
  // Maybe the from date is invalid!
  /**
   * @todo Error handling.
   */
  let current = models.Calendar.getCalendar({
    from: moment().subtract(1, "years").day(0).format(),
    to: moment().format(),
  }).data;

  if (current instanceof Object) {
    const { createdAt } = models.Platform.getLowestCreatedAtYear();
    let years = [];

    /**
     * @todo Error handling.
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
}

export { mergedCalendar };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
