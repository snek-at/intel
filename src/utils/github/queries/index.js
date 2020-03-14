import moment from "moment";
import * as queries from "./data";

/**
 * Providing the static profile query.
 */
function profile() {
  return queries.profile();
}

/**
 * Providing the dynamically generated calendar query.
 * A successfully resolved profile is needed in order
 * to generate the query.
 */
function calendar(profile) {
  let date = moment(profile.createdAt);
  let fragments = "";
  let runtime = moment().year() - date.year();

  for (let index = 0; index <= runtime; index++) {
    fragments += queries.calendarFragment(
      date.year(),
      moment(date)
        .month(0)
        .date(1)
        .format(),
      moment(date)
        .month(11)
        .date(31)
        .format()
    );
    date.add(1, "year");
  }
  return queries.calendar(fragments);
}

export { profile, calendar };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
