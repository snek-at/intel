import moment from "moment";
import * as queries from "./data";

export interface IProfile{
  createdAt: string;
}

function profile() {
  return queries.profile();
}

function calendar(profile: IProfile) {
  let date = moment(profile.createdAt);
  let fragments = "";
  let runtime = moment().year() - date.year();

  for (let index = 0; index <= runtime; index++) {
    fragments += queries.calendar_fragment(
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
 * Copyright © Simon Prast
 */