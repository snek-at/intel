//> Imports
// Contains all queries for github graphql api.
import * as queries from "./data";
// Contains helper functions for the models.
import moment from "moment";

export interface IProfile {
  createdAt: string;
}

/**
 * Profile query.
 *
 * @returns A query in DocumentNode format.
 * @description Get a query used for github profile data.
 */
function profile() {
  return queries.profile();
}

/**
 * Calendar query.
 * 
 * @param profile The resolved profile query of the github api.
 * @returns A query in DocumentNode format.
 * @description Get a query used for github profile data.
 */
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
