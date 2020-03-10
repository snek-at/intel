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

//> Classes
/*
  A general underlying statement object on which
  all statement objects are based.
  SOAssembler and squeezer are provided.
*/
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
  A statement object with connection to platform
  sql statements. 
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
    //> Usage
    // Creates a repository within a platform.

    //> Implementation example
    //let repository = Repository.objects.create(fields);

    //if (repository.success === false) {
    //  repository = Repository.objects.filter({
    //    url: fields.url
    //  })[0];
    //}

    //PlatformHasRepository.objects.create(
    //  {
    //    platformId: this.id,
    //    repositoryId: repository.id
    //  },
    //  Repository
    //);

    //return repository;
  }

  createOrganization(fields) {
    //> Usage
    // Creates a organization within a platform.

    //> Implementation example
    //let organization = Organization.objects.create(fields);

    //if (organization.success === false) {
    //  organization = Organization.objects.filter({
    //    url: fields.url
    //  })[0];
    //}

    //PlatformHasOrganization.objects.create(
    //  {
    //    platformId: this.id,
    //    organizationId: organization.id
    //  },
    //  Organization
    //);

    //return organization;
  }

  createStatistic(fields) {
    //> Usage
    // Creates a statistic within a platform.

    //> Implementation example
    //fields.platformId = this.id;
    //let statistic = Statistic.objects.create(fields);

    //return statistic;
  }

  createCalendarEntry(fields) {
    //> Usage
    // Creates a calendar entry within a platform.

    //> Implementation example
    //fields.platformId = this.id;
    //let calendar = Calendar.objects.create(fields);

    //return calendar;
  }

  getRepositories() {
    //> Usage
    // Get all repositories within a platform.

    //> Implementation example
    //let repositories = PlatformHasRepository.objects.filter(
    //  {
    //    platformId: this.id
    //  },
    //  Repository
    //);

    //return repositories;
  }

  getOrganizations() {
    //> Usage
    // Get all organizations within a platform.

    //> Implementation example
    //let organizations = PlatformHasOrganization.objects.filter(
    //  {
    //    platformId: this.id
    //  },
    //  Organization
    //);

    //return organizations;
  }

  getCalendar(dates) {
    //> Usage
    // Get merged calendar

    //> Implementation example
    //Calendar.getCalendar(dates);
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
  A statement object with connection to repository
  sql statements. 
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
    //> Usage
    // Create a member within a repository.

    //> Implementation example
    //let member = Member.objects.create({
    //  avatarUrl: fields.avatarUrl,
    //  url: fields.url,
    //  fullname: fields.fullname,
    //  username: fields.username,
    //  platformId: fields.platformId
    //});

    //if (member.success === false) {
    //  member = Member.objects.filter({
    //    username: fields.username,
    //    platformId: fields.platformId
    //  })[0];
    //}

    //RepositoryHasMember.objects.create({
    //  repositoryId: this.id,
    //  memberId: member.id
    //});

    //return member;
  }
  createLanguage(fields) {
    //> Usage
    // Create a languages within a repository.

    //> Implementation example
    //fields.repositoryId = this.id;
    //let language = Language.objects.create(fields);

    //return language;
  }

  getMembers() {
    //> Usage
    // Get all members of repository.

    //> Implementation example
    //let members = RepositoryHasMember.objects.filter(
    //  {
    //    repositoryId: this.id
    //  },
    //  Member
    //);

    //return members;
  }
}

/*
  A statement object with connection to repositoryHasMember
  sql statements. 
*/
class RepositoryHasMemberSO extends BaseSO {
  static statements = repositoryHasMember;

  //> Constructor
  constructor() {
    super();
  }
}

/*
  A statement object with connection to language
  sql statements. 
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
  A statement object with connection to platformHasRepository
  sql statements. 
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
  A statement object with connection to organization
  sql statements. 
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
  createMember(fields) {
    //> Usage
    // Create a member within a repository.

    //> Implementation example
    //let member = Member.objects.create({
    //  avatarUrl: fields.avatarUrl,
    //  url: fields.url,
    //  fullname: fields.fullname,
    //  username: fields.username,
    //  platformId: fields.platformId
    //});

    //if (member.success === false) {
    //  member = Member.objects.filter({
    //    username: fields.username,
    //    platformId: fields.platformId
    //  })[0];
    //}

    //OrganizationHasMember.objects.create({
    //  organizationId: this.id,
    //  memberId: member.id
    //});

    //return member;
  }

  getMembers(fields) {
    //> Usage
    // Get all members of a repository.

    //> Implementation example
    //let members = OrganizationHasMember.objects.filter(
    //  {
    //    organizationId: this.id
    //  },
    //  Member
    //);

    //return members;
  }
}

/*
  A statement object with connection to organizationHasMember
  sql statements. 
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
  A statement object with connection to platformHasOrganization
  sql statements. 
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
  A statement object with connection to statistic
  sql statements. 
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
  createStreak(fields) {
    //> Usage
    // Create a streak within a statistic.

    //> Implementation example
    //fields.statisticId = this.id;
    //let streak = Streak.objects.create(fields);

    //return streak;
  }

  getStreaks() {
    //> Usage
    // Get all streaks of a statistic.

    //> Implementation example
    //if (this.year || this.year === 0) {
    //  let { from, to } = this.getDates();
    //  let response = Calendar.getDaysBetweenDate(this, {
    //    from,
    //    to
    //  });
    //  response = helper.statistic.calculateStreaks(response);
    //  response = response.map((entry) => {
    //    return new Streak(entry);
    //  });

    //  return response;
    //}
    //return [];
  }

  getBusiestDay() {
    //> Usage
    // Get the busiest day between the result of getDates().

    //> Implementation example
    //if (this.year || this.year === 0) {
    //  let { from, to } = this.getDates();
    //  let response = Calendar.getBusiestDay({
    //    from,
    //    to
    //  });

    //  if (response) {
    //    response = new Calendar(response);
    //  }

    //  return response;
    //}
  }

  getDates(){
    //> Usage
    // Get the correct from and to date based on the year.

    //> Implementation example
    //let from, to;

    //if (this.year === 0) {
    //  from = moment()
    //    .subtract(1, "years")
    //    .day(0)
    //    .format();
    //  to = moment().format();
    //} else {
    //  from = moment()
    //    .year(this.year)
    //    .month(0)
    //    .day(0)
    //    .date(1)
    //    .format();
    //  to = moment()
    //    .year(this.year)
    //    .month(11)
    //    .day(31)
    //    .format();
    //}

    //return {
    //  from,
    //  to
    //};
  }
  
  getStreakDetails(streaks){
    //> Usage
    // Get the current and longest streak of streaks.

    //> Implementation example
    //let longest = {
    //  totalDays: 0
    //};
    //let current = {};

    //streaks.forEach((streak) => {
    //  if (streak.totalDays >= longest.totalDays) {
    //    longest = streak;
    //  }

    //  if (moment().diff(streak.endDate, "days") === 0) {
    //    current = streak;
    //  }
    //});

    //return {
    //  longest,
    //  current
    //};
  }
}

/*
  A statement object with connection to streak
  sql statements. 
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
  A statement object with connection to calendar
  sql statements. 
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
    let calendar = helper.calendar.generateCalendarStructure(
      dates.from,
      dates.to
    );

    calendar.weeks.forEach((week) => {
      week.days.forEach((day) => {
        let entries = SOAssambler.database.exec(
          CalendarSO.statements.dayByDate,
          [day.date]
        );

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
  createContribution(fields) {
    //> Usage
    // Create a contribution within a calendar entry.

    //> Implementation example
    //let contribution = Contribution.objects.create({
    //  id: fields.id,
    //  repoUrl: fields.repoUrl,
    //  datetime: fields.datetime,
    //  nameWithOwner: fields.nameWithOwner,
    //  type: fields.type,
    //  calendarId: this.id
    //});

    //return contribution;
  }
}

/*
  A statement object with connection to contribution
  sql statements.
  Currently the contribution statement object is not
  fully developed due to it is not used yet.
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
