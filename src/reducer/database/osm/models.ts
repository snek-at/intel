//> Reconstructor
// SOAssambler for SO objects
import { SOAssambler } from "./reconstructor";

//> Statements
// Contains SQL statements
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

/**
 * Implementaion examples of the statement objects defined below.
 *
 * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/models.ts|SNEK Models} for implementation examples.
 */

/**@class A basic statement object class which provides access to the SOAssambler and squeezer. */
export class BaseSO {
  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @param self A implementation of a statement object.
   * @return Connection to the SOAssambler.
   * @description Enables access to the SOAssambler to provide functionality like create, all, filter, ...
   */
  static getObjects(self: any) {
    return new SOAssambler(self);
  }

  /**
   * Render object.
   *
   * @param filter List of keys to filter by.
   * @return The filtered object.
   * @description Filter the object by a list of keys.
   */
  render(filter: string[]) {
    return helper.general.squeezer(this, filter);
  }
}

/**@class A statement object which implements the platform sql statements. */
class PlatformSO extends BaseSO {
  static statements = platform;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of PlatformSO and init BaseSO.
   */
  constructor() {
    super();
  }

  //> Static methods
  /**
   * @static
   * @description Get the platform with the lowest createdAt.
   * @return The first created platform.
   */
  static getLowestCreatedAtYear() {
    return SOAssambler.database.exec(
      PlatformSO.statements.lowestCreatedAtYear
    )[0];
  }
}

/**@class A statement object which implements the member sql statements. */
class MemberSO extends BaseSO {
  static statements = member;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of MemberSO and init BaseSO.
   */
  constructor() {
    super();
  }
}

/**@class A statement object which implements the repository sql statements. */
class RepositorySO extends BaseSO {
  static statements = repository;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of RepositorySO and init BaseSO.
   */
  constructor() {
    super();
  }

  //> Methods
  /**
   * @param cls A extended class of RepositorySO.
   * @param self A object of the extended class.
   * @description Get languages of a repository.
   * @return Languages.
   */
  getLanguages(cls: any, self: any) {
    let response = cls.objects.custom(language.byRepository(self.id));
    return response;
  }
}

/**@class A statement object which implements the platformHasMember sql statements. */
class RepositoryHasMemberSO extends BaseSO {
  static statements = repositoryHasMember;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of RepositoryHasMemberSO and init BaseSO.
   */
  constructor() {
    super();
  }
}

/**@class A statement object which implements the language sql statements. */
class LanguageSO extends BaseSO {
  static statements = language;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of LanguageSO and init BaseSO.
   */
  constructor() {
    super();
  }

  //> Static methods
  /**
   * @static
   * @description Get merged languages over all platforms.
   * @return Languages.
   */
  static getLanguages() {
    return SOAssambler.database.exec(LanguageSO.statements.merged);
  }
}

/**@class A statement object which implements the platformHasRepository sql statements. */
class PlatformHasRepositorySO extends BaseSO {
  static statements = platformHasRepository;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of PlatformHasRepositorySO and init BaseSO.
   */
  constructor() {
    super();
  }
}

/**@class A statement object which implements the organization sql statements. */
class OrganizationSO extends BaseSO {
  static statements = organization;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of OrganizationSO and init BaseSO.
   */
  constructor() {
    super();
  }

  //> Methods
  /**
   * @param cls A extended class of OrganizationSO.
   * @param self A object of the extended class.
   * @description Get all repositories belonging to a organization.
   * @return Languages.
   */
  getRepositories(cls: any, self: any) {
    let response = cls.objects.filter(
      {
        owner: self.name,
      },
      cls,
      repository.withOwner
    );

    return response;
  }
}

/**@class A statement object which implements the organizationHasMember sql statements. */
class OrganizationHasMemberSO extends BaseSO {
  static statements = organizationHasMember;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of OrganizationHasMemberSO and init BaseSO.
   */
  constructor() {
    super();
  }
}

/**@class A statement object which implements the platformHasOrganization sql statements. */
class PlatformHasOrganizationSO extends BaseSO {
  static statements = platformHasOrganization;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of PlatformHasOrganizationSO and init BaseSO.
   */
  constructor() {
    super();
  }
}

/**@class A statement object which implements the statistic sql statements. */
class StatisticSO extends BaseSO {
  static statements = statistic;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of StatisticSO and init BaseSO.
   */
  constructor() {
    super();
  }

  //> Static methods
  /**
   * @static
   * @param cls A extended class of StatisticSO.
   * @description Get a merged statistic over all platforms.
   * @return Statistic.
   */
  static getMerged(cls: any) {
    let response = SOAssambler.database.exec(StatisticSO.statements.allMerged);

    // Parse to class objects
    response = response.map((entry: any) => {
      return new cls(entry);
    });

    return response;
  }

  //> Methods
  /**
   * @param self A object of the extended class of StatisticSO.
   * @description Get a merged contributions over all platforms.
   * @return Statistic.
   */
  getContributions(self: any) {
    let response;
    if (self.id) {
      // If valid object
    } else {
      // maybe merged object?
      response = {
        commit: SOAssambler.database.exec(
          StatisticSO.statements.commitContributionsOfYear,
          [self.year]
        )[0] as number,
        issue: SOAssambler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0] as number,
        pullRequest: SOAssambler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0] as number,
        pullRequestReview: SOAssambler.database.exec(
          StatisticSO.statements.pullRequestReviewContributionsOfYear,
          [self.year]
        )[0] as number,
      };
    }
    return response;
  }
}

/**@class A statement object which implements the streak sql statements. */
class StreakSO extends BaseSO {
  static statements = streak;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of StreakSO and init BaseSO.
   */
  constructor() {
    super();
  }
}

/**@class A statement object which implements the calendar sql statements. */
class CalendarSO extends BaseSO {
  static statements = calendar;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of CalendarSO and init BaseSO.
   */
  constructor() {
    super();
  }

  //> Static methods
  /**
   * @static
   * @param dates From and to date.
   * @description Get all days between two dates.
   * @return List of days.
   */
  static getDaysBetweenDate(dates: { from: string; to: string }) {
    let days = SOAssambler.database.exec(CalendarSO.statements.betweenDate, [
      dates.from,
      dates.to,
    ]);
    return days;
  }

  /**
   * @static
   * @param dates From and to date.
   * @description Get the busiest day between two dates.
   * @return List of days.
   */
  static getBusiestDay(dates: { from: string; to: string }) {
    let response = SOAssambler.database.exec(
      CalendarSO.statements.busiestDayBetweenDate,
      [dates.from, dates.to]
    )[0];
    return response;
  }

  /**
   * @static
   * @param dates From and to date.
   * @description Get a generated calendar containing days between from and to date.
   * @return A complete calendar.
   */
  static getCalendar(dates: { from: string; to: string }) {
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
      if (busiestDay) {
        busiestDayTotal = busiestDay.total;
      }
      helper.calendar.fillCalendarWithColors(calendar, busiestDayTotal);

      return {
        success: true,
        data: calendar
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        data: helper.calendar.generateCalendarStructure(
          dates.from,
          dates.to
        ),
        message: "Check for data in the calendar table.",
      };
    }
  }
}

/**@class A statement object which implements the contribution sql statements. */
class ContributionSO extends BaseSO {
  static statements = contribution;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @constructor
   * @author: schettn
   * @description Creates a instance of ContributionSO and init BaseSO.
   */
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
  ContributionSO,
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
