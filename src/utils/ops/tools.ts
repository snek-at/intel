//#PACKAGE "moment"
//## npm install "moment"@2.25.3
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";
//> Reducer
// Contains the reducer and database models
import { Reducer } from "../../reducer";
//> Models
// Contains all reducer database models
import * as models from "../../reducer/database/models";
//> Helper
// Contains helper functions for the models
import * as helper from "../../reducer/helper/calendar";

const mergeCodetransition = (arr: any[]) => {
  const reducer = new Reducer();

  arr.sort((a, b) => (moment(a.datetime) > moment(b.datetime) ? 1 : -1));

  if (arr.length > 0) {
    const platform = models.Platform.objects.create({
      platformName: moment().toString(),
      platformUrl: "ops.local",
      avatarUrl: "",
      websiteUrl: "",
      company: null,
      email: null,
      username: "",
      fullName: "",
      createdAt: arr[0].datetime,
      location: null,
      statusMessage: "",
      statusEmojiHTML: "",
    }) as models.Platform;

    const days: any[] = [];

    arr.reduce(function (res: any, value: any) {
      const date = value.datetime.split(" ")[0];
      if (!res[date]) {
        res[date] = {
          date: date,
          total: 0,
        };
        days.push(res[date]);
      }
      try {
        res[value.datetime.split(" ")[0]].total +=
          parseInt(value.insertions) - parseInt(value.deletions);
      } catch {}

      return res;
    }, {});

    /* Process days and create calendarEntries and contributions */
    for (let date in days) {
      /* Create calendarEntry */
      platform.createCalendarEntry({
        date: days[date].date,
        total: days[date].total,
      });
    }

    const calendar = helper.mergedCalendar();

    reducer.reset();

    return calendar;
  }
};

const mergeContributionFeed = (arr: any[]) => {
  const reducer = new Reducer();

  arr.sort((a, b) => (moment(a.datetime) > moment(b.datetime) ? 1 : -1));

  if (arr.length > 0) {
    const platform = models.Platform.objects.create({
      platformName: moment().toString(),
      platformUrl: "ops.local",
      avatarUrl: "",
      websiteUrl: "",
      company: null,
      email: null,
      username: "",
      fullName: "",
      createdAt: arr[0].datetime,
      location: null,
      statusMessage: "",
      statusEmojiHTML: "",
    }) as models.Platform;

    const days: any[] = [];

    arr.reduce(function (res: any, value: any) {
      const date = value.datetime.split(" ")[0];
      if (!res[date]) {
        res[date] = {
          date: date,
          total: 0,
        };
        days.push(res[date]);
      }
      try {
        res[value.datetime.split(" ")[0]].total += 1;
      } catch {}

      return res;
    }, {});

    /* Process days and create calendarEntries and contributions */
    for (let date in days) {
      /* Create calendarEntry */
      platform.createCalendarEntry({
        date: days[date].date,
        total: days[date].total,
      });
    }

    const calendar = helper.mergedCalendar();

    reducer.reset();

    return calendar;
  }
};

export { mergeCodetransition, mergeContributionFeed };
