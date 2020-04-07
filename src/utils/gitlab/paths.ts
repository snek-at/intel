/**
 * Define Gitlab website paths.
 */
const root = "/";
export const home = (username: string) => root + "users/" + username;
export const currentCalendar = (username: string) => home(username) + "/calendar";
export const activity = (username: string) => root + username + "?limit=2147483647";
export const atom = (username: string) => root + username + ".atom?limit=2147483647";
export const groups = (username: string) => home(username) + "/groups.json";
export const projects = (username: string) => home(username) + "/projects.json";
