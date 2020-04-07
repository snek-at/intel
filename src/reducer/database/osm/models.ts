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

export class BaseSO {
  //static objects = SOAssambler;

  static getObjects(self: any) {
    return new SOAssambler(self);
  }

  render(filter: string[]) {
    return helper.general.squeezer(this, filter);
  }
}

class PlatformSO extends BaseSO {
  static statements = platform;

  constructor() {
    super();
  }
  createRepository(fields:any) {}
  createOrganization(fields:any) {}
  createStatistic(fields:any) {}

  getOrganizations(fields:any) {}
  getRepositories(fields:any) {}
  getStatistics(fields:any) {}

  static getLowestCreatedAtYear() {
    return SOAssambler.database.exec(
      PlatformSO.statements.lowestCreatedAtYear
    )[0];
  }
}

class MemberSO extends BaseSO {
  static statements = member;

  constructor() {
    super();
  }
}

class RepositorySO extends BaseSO {
  static statements = repository;

  constructor() {
    super();
  }

  createMember(fields:any) {}
  createLanguage(fields:any) {}

  getMembers() {}
  getLanguages(cls:any, self:any) {
    let response = cls.objects.custom(language.byRepository(self.id));
    return response;
  }
}

class RepositoryHasMemberSO extends BaseSO {
  static statements = repositoryHasMember;

  constructor() {
    super();
  }
}

class LanguageSO extends BaseSO {
  static statements = language;

  constructor() {
    super();
  }

  static getLanguages() {
    return SOAssambler.database.exec(LanguageSO.statements.merged);
  }
}

class PlatformHasRepositorySO extends BaseSO {
  static statements = platformHasRepository;

  constructor() {
    super();
  }
}

class OrganizationSO extends BaseSO {
  static statements = organization;

  constructor() {
    super();
  }

  createMember(fields:any) {}

  getMembers(fields:any) {}

  getRepositories(cls:any, self:any) {
    let response = cls.objects.filter(
      {
        owner: self.name
      },
      cls,
      repository.withOwner
    );

    return response;
  }
}

class OrganizationHasMemberSO extends BaseSO {
  static statements = organizationHasMember;

  constructor() {
    super();
  }
}

class PlatformHasOrganizationSO extends BaseSO {
  static statements = platformHasOrganization;

  constructor() {
    super();
  }
}

class StatisticSO extends BaseSO {
  static statements = statistic;

  constructor() {
    super();
  }

  createStreak(fields:any) {}

  getStreaks() {}

  static getMerged(cls: any) {
    let response = SOAssambler.database.exec(StatisticSO.statements.allMerged);

    // Parse to class objects
    response = response.map((entry:any) => {
      return new cls(entry);
    });

    return response;
  }

  getContributions(self:any) {
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
}

class StreakSO extends BaseSO {
  static statements = streak;

  constructor() {
    super();
  }
}

class CalendarSO extends BaseSO {
  static statements = calendar;

  constructor() {
    super();
  }

  createContribution(fields:any) {}

  static getDaysBetweenDate(self:any, dates:any) {
    let days = SOAssambler.database.exec(CalendarSO.statements.betweenDate, [
      dates.from,
      dates.to
    ]);
    return days;
  }

  static getBusiestDay(dates:any) {
    let response = SOAssambler.database.exec(
      CalendarSO.statements.busiestDayBetweenDate,
      [dates.from, dates.to]
    )[0];
    return response;
  }

  static getCalendar(dates:any) {
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
      let busiestDayTotal = 0;
      if(busiestDay){
        busiestDayTotal = busiestDay.total;
      }
      helper.calendar.fillCalendarWithColors(calendar, busiestDayTotal);

      return calendar;
    } catch(err){
      console.error(err);
      return {
        success: false,
        message: "Check for data in the calendar table."
      };
    }
  }
}

class ContributionSO extends BaseSO {
  static statements = contribution;

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
 * Copyright © Simon Prast
 */
