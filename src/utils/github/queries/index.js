import moment from "moment";
import * as queries from "./data";

function profile() {
  return queries.PROFILE();
}

function calendar(profile) {
  // console.log(profile)
  let date = moment(profile.createdAt);
  // console.log(date)

  let fragments = "";
  let runtime = moment().year() - date.year();

  for (let index = 0; index <= runtime; index++) {
    fragments += queries.CALENDAR_FRAGMENT(
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
  return queries.CALENDAR(fragments);
}

export { profile, calendar}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
