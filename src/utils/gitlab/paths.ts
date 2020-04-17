//#region > Paths
/* Define Gitlab website paths */
const root = "/";
const home = (username: string) => root + "users/" + username;
const currentCalendar = (username: string) => home(username) + "/calendar";
const activity = (username: string) => root + username + "?limit=2147483647";
const atom = (username: string) => root + username + ".atom?limit=2147483647";
const groups = (username: string) => home(username) + "/groups.json";
const projects = (username: string) => home(username) + "/projects.json";
//#endregion

//#region > Exports
export { home, currentCalendar, activity, atom, groups, projects };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
