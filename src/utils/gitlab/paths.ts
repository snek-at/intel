//#region > Paths
/* Define GitLab website paths */
const root = "/";
const home = (username: string) => root + username;
const currentCalendar = (username: string) =>
  root + "users/" + username + "/calendar";
const activity = (username: string) => root + username + "?limit=2147483647";
const atom = (username: string) => root + username + ".atom?limit=2147483647";
const groups = (username: string) =>
  root + "users/" + username + "/groups.json";
const projects = (username: string) =>
  root + "users/" + username + "/projects.json";
//#endregion

//#region > Exports
export { home, currentCalendar, activity, atom, groups, projects };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
