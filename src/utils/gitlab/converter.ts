//#region > Imports
//> Models
// Contains all reducer database models
import * as models from "../../reducer/database/models";
//> Moment
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";
//#endregion

//#region > Interfaces
/** @interfaces ScrapedData defines the data structure required for the converter. */
interface IScrapedData {
  platform: {
    url: string;
    name: string;
  };
  home: Document;
  atom?: Document;
  currentCalendar: { [index: string]: number };
  groups: {
    html: string;
  };
  projects: {
    html: string;
  };
  activity: {
    html: string;
  };
}

/** @interfaces CalendarDays defines the data structure for the calendar. */
interface CalendarDays {
  [date: string]: {
    contributions: {
      [type: string]: {
        [datetime: string]: { total: number; name: string; repoUrl: string };
      };
    };
    total: number;
  };
}

/** @interfaces Statistic defines the data structure for a statistic year. */
interface Statistic {
  [year: number]: {
    [type: string]: {
      total: number;
    };
  };
}
//#endregion

//#region > Functions
/**
 * Converter for data from the scraper.
 * @function
 * @param rawData Data to be processed. Must fit IScrapedData format.
 * @description Fill the database with data provided by "rawData".
 */
function runScraper(rawData: IScrapedData) {
  /* Extract platform data from rawData.home document */
  let platformName = rawData.home.querySelectorAll(
    '[property="og:site_name"]'
  )[0].attributes[0].value;

  let platformUrl = rawData.platform.url;
  let avatarUrl =
    platformUrl +
    rawData.home.querySelectorAll('[property="og:image"]')[0].attributes[0]
      .value;

  let websiteUrl = rawData.home.querySelectorAll('[property="og:url"]')[0]
    .attributes[0].value;

  let username = rawData.home
    .querySelectorAll('[data-action="overview"]')[0]
    .getAttribute("href")
    ?.slice(1);

  let fullName = rawData.home.querySelectorAll('[property="og:title"]')[0]
    .attributes[0].value;

  let createdAt = moment(
    new Date(
      rawData.home
        .getElementsByClassName("user-info")[0]
        .getElementsByTagName("p")[0]
        .getElementsByTagName("span")[1].innerHTML
    )
  ).format();

  let status = rawData.home.getElementsByClassName("cover-status")[0];
  let statusMessage = status?.lastChild?.textContent;
  let statusEmojiHTML = status?.getElementsByTagName("gl-emoji")[0].outerHTML;

  /* Create a platform with the associated platform data */
  let platform = models.Platform.objects.create({
    platformName,
    platformUrl,
    avatarUrl,
    websiteUrl,
    company: null,
    email: null,
    username,
    fullName,
    createdAt,
    location: null,
    statusMessage,
    statusEmojiHTML,
  });

  /* Extract organization data from rawData.groups */
  let groups = new DOMParser().parseFromString(
    rawData.groups.html,
    "text/html"
  );

  let groupList = groups
    .getElementsByClassName("content-list")[0]
    ?.getElementsByTagName("li");

  if (groupList) {
    for (let index = 0; index < groupList.length; index++) {
      const element = groupList[index];
      /* Select avatar. Set to null if no image is set */
      let avatarUrl = element
        .getElementsByClassName("avatar-container")[0]
        .getElementsByTagName("img")[0]
        ?.getAttribute("data-src");

      if (avatarUrl) {
        avatarUrl = platformUrl + avatarUrl;
      } else {
        avatarUrl = null;
      }

      /* Select url and name */
      let nameElement = element
        .getElementsByClassName("title")[0]
        .getElementsByClassName("group-name")[0];

      let url = platformUrl + nameElement.getAttribute("href");
      let name = nameElement.getAttribute("href")?.slice(1);
      let fullName = nameElement.innerHTML;

      /* Create a organization within the platform */
      platform.createOrganization({
        avatarUrl,
        url,
        name,
        fullname: fullName,
      });
    }
  }

  /* Extract repository data from rawData.projects */
  let projects = new DOMParser().parseFromString(
    rawData.projects.html,
    "text/html"
  );

  let projectsList = projects
    .getElementsByClassName("projects-list")[0]
    ?.getElementsByTagName("li");

  if (projectsList) {
    for (let index = 0; index < projectsList.length; index++) {
      const element = projectsList[index];
      /* Select avatar. Set to null if no image is set */
      let avatarUrl = element
        .getElementsByClassName("avatar-container")[0]
        .getElementsByTagName("img")[0]
        ?.getAttribute("data-src");

      if (avatarUrl) {
        avatarUrl = platformUrl + avatarUrl;
      } else {
        avatarUrl = null;
      }

      /* Select url and name */
      let nameElement = element
        .getElementsByClassName("avatar-container")[0]
        .getElementsByTagName("a")[0];

      let url = platformUrl + nameElement.getAttribute("href");
      let name = nameElement.getAttribute("href")?.slice(1);

      /* Create a repository within the platform */
      platform.createRepository({
        avatarUrl,
        url,
        name,
        owner_id: null,
      });
    }
  }

  /* Extract activity list from rawData.activity */
  let events = new DOMParser().parseFromString(
    rawData.activity.html,
    "text/html"
  );

  let eventList = events.getElementsByClassName("event-item");
  let days: CalendarDays = {};
  let stats: Statistic = {};

  /* Check whether there are contributions/events or not */
  if (eventList) {
    /*
      Loop trough every item in the event list.
      Extract contribution data from element.
    */
    for (let index = 0; index < eventList.length; index++) {
      const element = eventList[index];
      /* Define the contribution types */
      let type: string = "undefined";

      if (element.innerHTML.toLowerCase().includes("pushed")) {
        type = "commit";
      } else if (element.innerHTML.toLowerCase().includes("opened")) {
        type = "issue";
      } else if (element.innerHTML.toLowerCase().includes("merge branch")) {
        type = "pullRequest";
      } else if (element.innerHTML.toLowerCase().includes("created project")) {
        type = "create";
      }

      /* Select date */
      let date = moment(element.getElementsByTagName("time")[0].dateTime);
      /* Select repository name contributed to */
      let name = element
        .getElementsByClassName("event-scope")[0]
        ?.getElementsByTagName("a")[0]
        .getAttribute("href");

      if (!name) {
        name = element
          .getElementsByClassName("event-title")[0]
          .getElementsByTagName("a")[0]
          .getAttribute("href");
        if (!name) {
          name = "";
        }
      }

      /* Select the "and n more commits" and set the default contribution number */
      let moreCommitText = element
        .getElementsByClassName("commits-stat")[0]
        ?.getElementsByTagName("span")[0].innerText;

      let contributionCount = 1;

      if (moreCommitText) {
        let moreCommitsCount = moreCommitText.match(/\d/g)?.join("");

        if (moreCommitsCount) {
          contributionCount += parseInt(moreCommitsCount);
        }
      }

      /* Format date and datetime to string */
      let dateStr = date.format("YYYY-MM-DD");
      let datetimeStr = date.format("YYYY-MM-DDTHH:mm:ss");

      /* Calculate the contribution types */
      if (!days[dateStr]?.contributions?.[`${type}`]?.datetimeStr) {
        if (days[dateStr]) {
          if (days[dateStr].contributions) {
            if (days[dateStr].contributions[`${type}`]) {
              days[dateStr].contributions[`${type}`][datetimeStr] = {
                total: contributionCount,
                name: name.slice(1),
                repoUrl: platformUrl + name,
              };
            } else {
              days[dateStr].contributions[`${type}`] = {
                [datetimeStr]: {
                  total: contributionCount,
                  name: name.slice(1),
                  repoUrl: platformUrl + name,
                },
              };
            }
            days[dateStr].total += contributionCount;
          } else {
            days[dateStr] = {
              contributions: {
                [`${type}`]: {
                  [datetimeStr]: {
                    total: contributionCount,
                    /* Remove "/" from name. E.g: /schettn to schettn */
                    name: name.slice(1),
                    repoUrl: platformUrl + name,
                  },
                },
              },
              total: contributionCount,
            };
          }
        } else {
          days[dateStr] = {
            contributions: {
              [`${type}`]: {
                [datetimeStr]: {
                  total: contributionCount,
                  /* Remove "/" from name. E.g: /schettn to schettn */
                  name: name.slice(1),
                  repoUrl: platformUrl + name,
                },
              },
            },
            total: contributionCount,
          };
        }
      }

      /* Set the total contribution per type */
      if (!stats[date.year()]) {
        stats[date.year()] = { [`${type}`]: { total: 0 } };
      } else if (!stats[date.year()][`${type}`]) {
        stats[date.year()][`${type}`] = { total: 0 };
      }

      stats[date.year()][`${type}`].total += contributionCount;
    }

    /* Process days and create calendarEntries and contributions */
    for (let date in days) {
      /* Create calendarEntry */
      let calendarDay = platform.createCalendarEntry({
        date: date,
        total: days[date].total,
      });

      /* Create contributions */
      for (let type in days[date].contributions) {
        /* Create multiple contributions if they were contributed on the same datetime */
        for (let datetime in days[date].contributions[type]) {
          calendarDay.createContribution({
            repoUrl: days[date].contributions[type][datetime].repoUrl,
            datetime,
            nameWithOwner: days[date].contributions[type][datetime].name,
            type: type,
          });
        }
      }
    }

    /* Process stats and create statistics */
    for (let year in stats) {
      /* Set whole year to current year if the year matches today */
      if (year === new Date().getFullYear().toString()) {
        platform.createStatistic({
          year: 0,
          totalIssueContributions: stats[year]["issue"]?.total
            ? stats[year]["issue"].total
            : 0,
          totalCommitContributions: stats[year]["commit"]?.total
            ? stats[year]["commit"].total
            : 0,
          totalRepositoryContributions: stats[year]["create"]?.total
            ? stats[year]["create"].total
            : 0,
          totalPullRequestContributions: stats[year]["pullRequest"]?.total
            ? stats[year]["pullRequest"].total
            : 0,
          totalPullRequestReviewContributions: 0, // currently not provided by Gitlab
          totalRepositoriesWithContributedIssues: 0, // currently not provided by Gitlab
          totalRepositoriesWithContributedCommits: 0, // currently not provided by Gitlab
          totalRepositoriesWithContributedPullRequests: 0, // currently not provided by Gitlab
        });
      }

      platform.createStatistic({
        year,
        totalIssueContributions: stats[year]["issue"]?.total
          ? stats[year]["issue"].total
          : 0,
        totalCommitContributions: stats[year]["commit"]?.total
          ? stats[year]["commit"].total
          : 0,
        totalRepositoryContributions: stats[year]["create"]?.total
          ? stats[year]["create"].total
          : 0,
        totalPullRequestContributions: stats[year]["pullRequest"]?.total
          ? stats[year]["pullRequest"].total
          : 0,
        totalPullRequestReviewContributions: 0, // currently not provided by Gitlab
        totalRepositoriesWithContributedIssues: 0, // currently not provided by Gitlab
        totalRepositoriesWithContributedCommits: 0, // currently not provided by Gitlab
        totalRepositoriesWithContributedPullRequests: 0, // currently not provided by Gitlab
      });
    }
  }
}
//#endregion

//#region > Exports
export { runScraper };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
