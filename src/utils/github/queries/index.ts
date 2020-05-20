//#region > Imports
//#PACKAGE "moment"
//## npm install "moment"@2.25.3
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";
//> Queries
// Contains all queries for github graphql api
import * as queries from "./data";
//#endregion

//#region > Interfaces
/**
 * @interface Profile defines the structure of the profile object which is required to generate the calendar query
 * @description Only createdAt is defined due to no more information is needed to generate the calendar query
 */
interface IProfile {
  /**
   * CreatedAt: A datetime string which defines the day where a account of a provided platform was created.
   */
  createdAt: string;
}
//#endregion

//#region > Functions
/**
 * Profile query.
 *
 * @returns {DocumentNode} A query in DocumentNode format
 * @description Get a query used for github profile data
 */
function profile() {
  return queries.profile();
}

/**
 * Calendar query.
 *
 * @param profile The resolved profile query of the github api
 * @returns {DocumentNode} A query in DocumentNode format
 * @description Get a query used for github profile data
 */
function calendar(profile: IProfile) {
  let date = moment(profile.createdAt);
  let fragments = "";
  let runtime = moment().year() - date.year();

  for (let index = 0; index <= runtime; index++) {
    fragments += queries.calendarFragment(
      date.year(),
      moment(date).month(0).date(1).format(),
      moment(date).month(11).date(31).format()
    );
    date.add(1, "year");
  }

  return queries.calendar(fragments);
}
//#endregion

//#region > Exports
export type { IProfile };
export { profile, calendar };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
