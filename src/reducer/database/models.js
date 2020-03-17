//> Moment
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";

//> Object Statement Mapping
// Contains all models
import * as osm from "./osm";
//> Helper
// Contains all database helper functions
import * as helper from "./helper";

//> Classes
/**
 * A model which uses the platform statement
 * objects and the getObjects of the base statement
 * object.
 */
class Platform extends osm.models.PlatformSO {
  static objects = this.getObjects(this);

  //> Constructor
  constructor(args) {
    super();

    this.id = args["id"];
    this.platformName = args["platformName"];
    this.platformUrl = args["platformUrl"];
    this.avatarUrl = args["avatarUrl"];
    this.websiteUrl = args["websiteUrl"];
    this.company = args["company"];
    this.email = args["email"];
    this.username = args["username"];
    this.fullName = args["fullName"];
    this.createdAt = args["createdAt"];
    this.location = args["location"];
    this.statusMessage = args["statusMessage"];
    this.statusEmojiHTML = args["statusEmojiHTML"];
  }

  //> Methods
  createRepository(fields) {
    let repository = Repository.objects.create(fields);

    if (repository.success === false) {
      repository = Repository.objects.filter({
        url: fields.url
      })[0];
    }

    PlatformHasRepository.objects.create(
      {
        platformId: this.id,
        repositoryId: repository.id
      },
      Repository
    );

    return repository;
  }

  createOrganization(fields) {
    let organization = Organization.objects.create(fields);

    if (organization.success === false) {
      organization = Organization.objects.filter({
        url: fields.url
      })[0];
    }

    PlatformHasOrganization.objects.create(
      {
        platformId: this.id,
        organizationId: organization.id
      },
      Organization
    );

    return organization;
  }

  createStatistic(fields) {
    fields.platformId = this.id;
    let statistic = Statistic.objects.create(fields);

    return statistic;
  }

  createCalendarEntry(fields) {
    fields.platformId = this.id;
    let calendar = Calendar.objects.create(fields);

    return calendar;
  }

  getRepositories() {
    let repositories = PlatformHasRepository.objects.filter(
      {
        platformId: this.id
      },
      Repository
    );

    return repositories;
  }

  getOrganizations() {
    let organizations = PlatformHasOrganization.objects.filter(
      {
        platformId: this.id
      },
      Organization
    );

    return organizations;
  }

  getCalendar(dates) {
    Calendar.getCalendar(dates);
  }
}

/**
 * A model which uses the member statement
 * objects and the getObjects of the base statement
 * object.
 */
class Member extends osm.models.MemberSO {
  static objects = this.getObjects(this);

  //> Constructor
  constructor(args) {
    super();

    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.fullname = args["fullname"];
    this.username = args["username"];
    this.platformId = args["platformId"];
  }
}

/**
 * A model which uses the repository statement
 * objects and the getObjects of the base statement
 * object.
 */
class Repository extends osm.models.RepositorySO {
  static objects = this.getObjects(this);

  //> Constructor
  constructor(args) {
    super();

    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.ownerId = args["ownerId"];
  }

  //> Methods
  createMember(fields) {
    let member = Member.objects.create({
      avatarUrl: fields.avatarUrl,
      url: fields.url,
      fullname: fields.fullname,
      username: fields.username,
      platformId: fields.platformId
    });

    if (member.success === false) {
      member = Member.objects.filter({
        username: fields.username,
        platformId: fields.platformId
      })[0];
    }

    RepositoryHasMember.objects.create({
      repositoryId: this.id,
      memberId: member.id
    });

    return member;
  }

  createLanguage(fields) {
    fields.repositoryId = this.id;
    let language = Language.objects.create(fields);

    return language;
  }

  getMembers() {
    let members = RepositoryHasMember.objects.filter(
      {
        repositoryId: this.id
      },
      Member
    );

    return members;
  }

  getLanguages() {
    return super.getLanguages(Language, this);
  }
}

/**
 * A model which uses the repositoryHasMember
 * statement objects and the getObjects of
 * the base statement object.
 */
class RepositoryHasMember extends osm.models.RepositoryHasMemberSO {
  static objects = this.getObjects(this);
}

/**
 * A model which uses the language statement
 * objects and the getObjects of the base statement
 * object.
 */
class Language extends osm.models.LanguageSO {
  static objects = this.getObjects(this);

  //> Constructor
  constructor(args) {
    super();

    this.id = args["id"];
    this.color = args["color"];
    this.name = args["name"];
    this.size = args["size"];
    this.share = args["share"];
    this.repositoryId = args["repositoryId"];
  }

  //> Static Methods
  static getLanguages() {
    let response = super.getLanguages();
    response = response.map((entry) => {
      return new Language(entry);
    });

    return response;
  }
}

/**
 * A model which uses the platformHasRepository
 * statement objects and the getObjects of
 * the base statement object.
 */
class PlatformHasRepository extends osm.models.PlatformHasRepositorySO {
  static objects = this.getObjects(this);
}

/**
 * A model which uses the organization statement
 * objects and the getObjects of the base statement
 * object.
 */
class Organization extends osm.models.OrganizationSO {
  static objects = this.getObjects(this);

  //> Constructor
  constructor(args) {
    super();

    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.fullname = args["fullname"];
    this.member = Member;
  }

  //> Methods
  createMember(fields) {
    let member = Member.objects.create({
      avatarUrl: fields.avatarUrl,
      url: fields.url,
      fullname: fields.fullname,
      username: fields.username,
      platformId: fields.platformId
    });

    if (member.success === false) {
      member = Member.objects.filter({
        username: fields.username,
        platformId: fields.platformId
      })[0];
    }

    OrganizationHasMember.objects.create({
      organizationId: this.id,
      memberId: member.id
    });

    return member;
  }

  getMembers() {
    let members = OrganizationHasMember.objects.filter(
      {
        organizationId: this.id
      },
      Member
    );

    return members;
  }

  getRepositories() {
    return super.getRepositories(Repository, this);
  }
}

/**
 * A model which uses the organizationHasMember
 * statement objects and the getObjects of
 * the base statement object.
 */
class OrganizationHasMember extends osm.models.OrganizationHasMemberSO {
  static objects = this.getObjects(this);
}

/**
 * A model which uses the platformHasOrganization
 * statement objects and the getObjects of
 * the base statement object.
 */
class PlatformHasOrganization extends osm.models.PlatformHasOrganizationSO {
  static objects = this.getObjects(this);
}

/**
 * A model which uses the statistic statement
 * objects and the getObjects of the base statement
 * object.
 */
class Statistic extends osm.models.StatisticSO {
  static objects = this.getObjects(this);

  //> Constructor
  constructor(args) {
    super();

    this.id = args["id"];
    this.year = args["year"];
    this.totalIssueContributions = args["totalIssueContributions"];
    this.totalCommitContributions = args["totalCommitContributions"];
    this.totalRepositoryContributions = args["totalRepositoryContributions"];
    this.totalPullRequestContributions = args["totalPullRequestContributions"];
    this.totalPullRequestReviewContributions =
      args["totalPullRequestReviewContributions"];
    this.totalRepositoriesWithContributedIssues =
      args["totalRepositoriesWithContributedIssues"];
    this.totalRepositoriesWithContributedCommits =
      args["totalRepositoriesWithContributedCommits"];
    this.totalRepositoriesWithContributedPullRequests =
      args["totalRepositoriesWithContributedPullRequests"];
    this.platformId = args["platformId"];
  }

  //> Methods
  createStreak(fields) {
    fields.statisticId = this.id;
    let streak = Streak.objects.create(fields);

    return streak;
  }

  getDates() {
    let from, to;

    if (this.year === 0) {
      from = moment()
        .subtract(1, "years")
        .day(0)
        .format();
      to = moment().format();
    } else {
      from = moment()
        .year(this.year)
        .month(0)
        .day(0)
        .date(1)
        .format();
      to = moment()
        .year(this.year)
        .month(11)
        .day(31)
        .format();
    }

    return {
      from,
      to
    };
  }

  getStreaks() {
    if (this.year || this.year === 0) {
      let { from, to } = this.getDates();
      let response = Calendar.getDaysBetweenDate(this, {
        from,
        to
      });
      response = helper.statistic.calculateStreaks(response);
      response = response.map((entry) => {
        return new Streak(entry);
      });

      return response;
    }
    return [];
  }

  getStreakDetail(streaks) {
    let longest = {
      totalDays: 0
    };
    let current = {};

    streaks.forEach((streak) => {
      if (streak.totalDays >= longest.totalDays) {
        longest = streak;
      }

      if (moment().diff(streak.endDate, "days") === 0) {
        current = streak;
      }
    });

    return {
      longest,
      current
    };
  }

  getBusiestDay() {
    if (this.year || this.year === 0) {
      let { from, to } = this.getDates();
      let response = Calendar.getBusiestDay({
        from,
        to
      });

      if (response) {
        response = new Calendar(response);
      }

      return response;
    }
  }

  getContributions() {
    return super.getContributions(this);
  }

  static getMerged() {
    return super.getMerged(Statistic);
  }
}

/**
 * A model which uses the streak statement
 * objects and the getObjects of the base statement
 * object.
 */
class Streak extends osm.models.StreakSO {
  static objects = this.getObjects(this);

  //> Constructor
  constructor(args) {
    super();

    this.id = args["id"];
    this.startDate = args["startDate"];
    this.endDate = args["endDate"];
    this.totalDays = args["totalDays"];
    this.totalContributions = args["totalContributions"];
    this.statisticId = args["statisticId"];
  }
}

/**
 * A model which uses the calendar statement
 * objects and the getObjects of the base statement
 * object.
 */
class Calendar extends osm.models.CalendarSO {
  static objects = this.getObjects(this);

  //> Constructor
  constructor(args) {
    super();

    this.id = args["id"];
    this.date = args["date"];
    this.total = args["total"];
    this.platformId = args["platformId"];
  }

  //> Methods
  createContribution(fields) {
    let contribution = Contribution.objects.create({
      id: fields.id,
      repoUrl: fields.repoUrl,
      datetime: fields.datetime,
      nameWithOwner: fields.nameWithOwner,
      type: fields.type,
      calendarId: this.id
    });

    return contribution;
  }
}

/**
 * A model which uses the contribution statement
 * objects and the getObjects of the base statement
 * object.
 */
class Contribution extends osm.models.ContributionSO {
  static objects = this.getObjects(this);

  constructor(args) {
    super();

    this.id = args["id"];
    this.repoUrl = args["repoUrl"];
    this.datetime = args["datetime"];
    this.nameWithOwner = args["nameWithOwner"];
    this.type = args["type"];
    this.calendarId = args["calendarId"];
  }
}

export {
  Platform,
  Statistic,
  Contribution,
  Repository,
  Language,
  Organization,
  Member,
  RepositoryHasMember,
  Calendar
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
