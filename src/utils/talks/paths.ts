//#region > Paths
/** Provides the Github APIv3 path for querying user talks */
const user = (username: string, page: number) =>
  `/search/code?q=user:${username} in:file extension:pdf&page=${page}`;

/** Provides the Github APIv3 path for querying organization talks */
const organization = (organizationName: string, page: number) =>
  `/search/code?q=org:${organizationName} in:file extension:pdf&page=${page}`;
//#endregion

//#region > Exports
//> Constants
export { user, organization };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
