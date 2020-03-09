import { SOAssambler } from "./reconstructor";

import * as platform from "./statements/platform";
import * as member from "./statements/member";
import * as repository from "./statements/repository";
import * as repositoryHasMember from "./statements/repositoryHasMember";
import * as platformHasRepository from "./statements/platformHasRepository";
import * as language from "./statements/language";
import * as organization from "./statements/organization";
import * as organizationHasMember from "./statements/organizationHasMember";
import * as platformHasOrganization from "./statements/platformHasOrganization";
import * as statistic from "./statements/statistic";
import * as streak from "./statements/streak";
import * as calendar from "./statements/calendar";
import * as contribution from "./statements/contribution";

// Statement Objects => SO
import * as helper from "../helper";

/*
  Comment
*/
//> Classes
class BaseSO {
  //> Methods
  static getObjects(self) {
    return new SOAssambler(self);
  }

  render(filter) {
    return helper.general.squeezer(this, filter);
  }
}

/*
  Comment
*/
class PlatformSO extends BaseSO {
  //> Fields
  static statements = platform;

  //> Constructor
  constructor() {
    super();
  }

  //> Methods
  static getLowestCreatedAtYear() {
    return SOAssambler.database.exec(
      PlatformSO.statements.lowestCreatedAtYear
    )[0];
  }

  //> Abstract Methods
  createRepository(fields) {
    // Comment
    // Abstract
  }
  createOrganization(fields) {
    // Comment
    // Abstract
  }
  createStatistic(fields) {
    // Comment
    // Abstract
  }
  createCalendarEntry(fields) {
    // Comment
    // Abstract
  }

  getOrganizations(fields) {
    // Comment
    // Abstract
  }
  getRepositories(fields) {
    // Comment
    // Abstract
  }
  getStatistics(fields) {
    // Comment
    // Abstract
  }
  getCalendar(fields) {
    // Comment
    // Abstract
  }
  getActivity(fields) {
    // Comment
    // Abstract
  }
}

/*
  Comment
*/
class MemberSO extends BaseSO {
  static statements = member;

  //> Constructor
  constructor() {
    super();
  }
}

/*
  Comment
*/
class RepositorySO extends BaseSO {
  //> Fields
  static statements = repository;

  //> Constructor
  constructor() {
    super();
  }

  //> Methods
  getLanguages(cls, self) {
    let response = cls.objects.custom(language.byRepository(self.id));
    return response;
  }

  //> Abstract Methods
  createMember(fields) {
    // Comment
    // Abstract
  }
  createLanguage(fields) {
    // Comment
    // Abstract
  }

  getMembers() {
    // Comment
    // Abstract
  }
}

/*
  Comment
*/
class RepositoryHasMemberSO extends BaseSO {
  static statements = repositoryHasMember;

  //> Constructor
  constructor() {
    super();
  }
}

/*
  Comment
*/
class LanguageSO extends BaseSO {
  //> Fields
  static statements = language;

  //> Constructor
  constructor() {
    super();
  }

  //> Methods
  static getLanguages() {
    return SOAssambler.database.exec(LanguageSO.statements.merged);
  }
}

/*
  Comment
*/
class PlatformHasRepositorySO extends BaseSO {
  //> Fields
  static statements = platformHasRepository;

  //> Constructor
  constructor() {
    super();
  }
}

/*
  Comment
*/
class OrganizationSO extends BaseSO {
  //> Fields
  static statements = organization;

  //> Constructor
  constructor() {
    super();
  }

  //> Methods
  getRepositories(cls, self) {
    let response = cls.objects.filter(
      {
        owner: self.name
      },
      cls,
      repository.withOwner
    );

    return response;
  }

  //> Abstract Methods
  createMember(fields) {}

  getMembers(fields) {}
}

/*
  Comment
*/
class OrganizationHasMemberSO extends BaseSO {
  //> Fields
  static statements = organizationHasMember;

  //> Constructor
  constructor() {
    super();
  }
}

/*
  Comment
*/
class PlatformHasOrganizationSO extends BaseSO {
  //> Fields
  static statements = platformHasOrganization;

  //> Constructor
  constructor() {
    super();
  }
}

/*
  Comment
*/
class StatisticSO extends BaseSO {
  //> Fields
  static statements = statistic;

  //> Constructor
  constructor() {
    super();
  }

  //> Methods
  static getMerged(Cls) {
    let response = SOAssambler.database.exec(StatisticSO.statements.allMerged);

    // Parse to class objects
    response = response.map((entry) => {
      return new Cls(entry);
    });

    return response;
  }

  getContributions(self) {
    let response;

    if (self.id) {
      // If valid object
    } else {
      // maybe merged object?
      response = {
        commit: SOAssambler.database.exec(
          StatisticSO.statements.commitContributionsOfYear,
          [self.year]
        )[0],
        issue: SOAssambler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0],
        pullRequest: SOAssambler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0],
        pullRequestReview: SOAssambler.database.exec(
          StatisticSO.statements.pullRequestReviewContributionsOfYear,
          [self.year]
        )[0]
      };
    }

    return response;
  }

  //> Abstract Methods
  createStreak(fields) {}

  getStreaks() {}
}

/*
  Comment
*/
class StreakSO extends BaseSO {
  //> Fields
  static statements = streak;

  //> Constructor
  constructor() {
    super();
  }
}

/*
  Comment
*/
class CalendarSO extends BaseSO {
  //> Fields
  static statements = calendar;

  //> Constructor
  constructor() {
    super();
  }

  //> Methods
  static getDaysBetweenDate(self, dates) {
    let days = SOAssambler.database.exec(CalendarSO.statements.betweenDate, [
      dates.from,
      dates.to
    ]);

    return days;
  }

  static getBusiestDay(dates) {
    let response = SOAssambler.database.exec(
      CalendarSO.statements.busiestDayBetweenDate,
      [dates.from, dates.to]
    )[0];

    return response;
  }

  static getCalendar(dates) {
    // generate calendar
    let calendar = helper.calendar.generateCalendarStructure(
      dates.from,
      dates.to
    );

    // fill totals
    calendar.weeks.forEach((week) => {
      week.days.forEach((day) => {
        let entries = SOAssambler.database.exec(
          CalendarSO.statements.dayByDate,
          [day.date]
        );

        //let entries = db.exec(query, [day.date]);
        let total = 0;

        if (entries.length > 0) {
          let selectedDay = entries[0];
          total = selectedDay.total;
        }

        day.total = total;
      });
    });

    try {
      let busiestDay = CalendarSO.getBusiestDay(dates);
      helper.calendar.fillCalendarWithColors(calendar, busiestDay.total);

      return calendar;
    } catch {
      return {
        success: false,
        message: "Check for data in the calendar table."
      };
    }
  }

  //> Abstract Methods
  createContribution(fields) {}
}

/*
  Comment
*/
class ContributionSO extends BaseSO {
  //> Fields
  static statements = contribution;

  //> Constructor
  constructor() {
    super();
  }
}

export {
  PlatformSO,
  MemberSO,
  RepositorySO,
  RepositoryHasMemberSO,
  LanguageSO,
  PlatformHasRepositorySO,
  OrganizationSO,
  OrganizationHasMemberSO,
  PlatformHasOrganizationSO,
  StatisticSO,
  StreakSO,
  CalendarSO,
  ContributionSO
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
