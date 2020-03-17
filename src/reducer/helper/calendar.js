//> Moment
// A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
import moment from "moment";

//> Database models
// Contains all database models
import * as models from "../database/models";

/**
 * Providing a merged calendar of all platforms over all years.
 */
function mergedCalendar() {
  let current = models.Calendar.getCalendar({
    from: moment()
      .subtract(1, "years")
      .day(0)
      .format(),
    to: moment().format()
  });

  if (current.success !== false) {
    const { createdAt } = models.Platform.getLowestCreatedAtYear();
    let years = [];

    for (let year = createdAt; year <= moment().year(); year++) {
      years.push(
        models.Calendar.getCalendar({
          from: moment()
            .year(year)
            .month(0)
            .date(1)
            .day(0)
            .format(),
          to: moment()
            .year(year)
            .month(11)
            .date(31)
            .format()
        })
      );
    }

    return {
      current,
      years
    };
  } else {
    return {
      current: {},
      years: {}
    };
  }
}

export { mergedCalendar };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
