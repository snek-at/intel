//#region > Imports
//# PACKAGE "moment"
//## npm install "moment"@2.25.3
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";
//> OSM
// Contains all statement objects
import * as osm from "./osm";
//> Helper
// Contains helper functions for the models
import * as helper from "./helper";
//#endregion

//#region > Interfaces
/** @interface Platform defines the structure of the platform model */
interface IPlatform {
  id: number;
  platformName: string;
  platformUrl: string;
  avatarUrl: string;
  websiteUrl: string;
  company: string;
  email: string;
  username: string;
  fullName: string;
  createdAt: string;
  location: string;
  statusMessage: string;
  statusEmojiHTML: string;
}

/** @interface Member defines the structure of the member model */
interface IMember {
  id: number;
  avatarUrl: string;
  url: string;
  fullname: string;
  username: string;
  platformId: number;
}

/** @interface Repository defines the structure of the repository model */
interface IRepository {
  id: number;
  avatarUrl: string;
  url: string;
  name: string;
  ownerId: number;
}

/** @interface Language defines the structure of the language model */
interface ILanguage {
  id: number;
  color: string;
  name: string;
  size: number;
  share: number;
  repositoryId: number;
}

/** @interface Organization defines the structure of the organization model */
interface IOrganization {
  id: number;
  avatarUrl: string;
  url: string;
  name: string;
  fullname: string;
  description: string;
  platformName: string;
}

/** @interface Statistic defines the structure of the statistic model */
interface IStatistic {
  id: number;
  year: number;
  totalIssueContributions: number;
  totalCommitContributions: number;
  totalRepositoryContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  totalRepositoriesWithContributedIssues: number;
  totalRepositoriesWithContributedCommits: number;
  totalRepositoriesWithContributedPullRequests: number;
  platformId: number;
}

/** @interface Streak defines the structure of the streak model */
interface IStreak {
  id: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalContributions: number;
  statisticId: number;
}

/** @interface Calendar defines the structure of the calendar model */
interface ICalendar {
  id: number;
  date: string;
  total: number;
  platformId: number;
}

/** @interface Contribution defines the structure of the contribution model */
interface IContribution {
  id: number;
  repoUrl: string;
  datetime: string;
  nameWithOwner: string;
  type: string;
  calendarId: number;
}

/** @interface Talk defines the structure of the talk model */
interface ITalk {
  id: number;
  name: string;
  url: string;
  displayUrl: string;
  downloadUrl: string;
  path: string;
  repositoryData: string;
}
//#endregion

//#region > Classes
/**
 * @class A OSM model for a platform object
 * @extends osm.models.PlatformSO Statement object
 */
class Platform extends osm.models.PlatformSO implements IPlatform {
  public static objects = osm.models.PlatformSO.getObjects(Platform);
  public objects = Platform.objects;

  public id = 0;
  public platformName = "";
  public platformUrl = "";
  public avatarUrl = "";
  public websiteUrl = "";
  public company = "";
  public email = "";
  public username = "";
  public fullName = "";
  public createdAt = "";
  public location = "";
  public statusMessage = "";
  public statusEmojiHTML = "";

  constructor(args: IPlatform) {
    super();

    this.createdAt = "adad";
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

  /**
   * Creates a repository within this platform.
   *
   * @param fields Repository data
   * @returns {Repository} A repository object
   */
  createRepository(fields: any): Repository {
    let repository = Repository.objects.create(fields);

    if (repository.success === false) {
      repository = Repository.objects.filter({
        url: fields.url,
      })[0];
    }

    PlatformHasRepository.objects.create({
      platformId: this.id,
      repositoryId: repository.id,
    });

    return repository as Repository;
  }

  /**
   * Creates a organization within this platform.
   *
   * @param fields Organization data
   * @returns {Organization} An organization object
   */
  createOrganization(fields: any): Organization {
    let organization = Organization.objects.create(fields);

    if (organization.success === false) {
      organization = Organization.objects.filter({
        url: fields.url,
      })[0];
    }

    PlatformHasOrganization.objects.create({
      platformId: this.id,
      organizationId: organization.id,
    });

    return organization as Organization;
  }

  /**
   * Creates a statistic of a year within this platform.
   *
   * @param fields Statistic data
   * @returns {Statistic} A statistic object
   */
  createStatistic(fields: any): Statistic {
    fields.platformId = this.id;

    let statistic = Statistic.objects.create(fields);

    return statistic as Statistic;
  }

  /**
   * Create a calendar entry.
   *
   * @param fields Calendar entry data.
   * @returns {Statistic} A calendar object
   * @description Create a day of a calendar with the given fields within this platform
   */
  createCalendarEntry(fields: any): Calendar {
    fields.platformId = this.id;

    let calendar = Calendar.objects.create(fields);

    return calendar as Calendar;
  }

  /**
   * Get all repositories within this platform.
   *
   * @returns {Repository[]} A list of repository objects
   */
  getRepositories(): Repository[] {
    let repositories = PlatformHasRepository.objects.filter(
      {
        platformId: this.id,
      },
      Repository
    );

    return repositories as Repository[];
  }

  /**
   * Get all organizations within this platform.
   *
   * @returns {Organization[]} A list of organization objects
   */
  getOrganizations(): Organization[] {
    let organizations = PlatformHasOrganization.objects.filter(
      {
        platformId: this.id,
      },
      Organization
    );

    return organizations as Organization[];
  }

  /**
   * Get a calendar.
   *
   * @returns {helper.calendar.ICalendar} A contribution calendar structure object
   * @description Get a merged contribution calendar from all platform data
   */
  getCalendar(dates: any) {
    let response = Calendar.getCalendar(dates);

    return response.data;
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a member object
 * @extends osm.models.MemberSO Statement object
 */
class Member extends osm.models.MemberSO {
  public static objects = osm.models.MemberSO.getObjects(Member);
  public objects = Member.objects;

  public id = 0;
  public avatarUrl = "";
  public url = "";
  public fullname = "";
  public username = "";
  public platformId = 0;

  constructor(args: IMember) {
    super();

    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.fullname = args["fullname"];
    this.username = args["username"];
    this.platformId = args["platformId"];
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a repository object
 * @extends osm.models.RepositorySO Statement object
 */
class Repository extends osm.models.RepositorySO implements IRepository {
  public static objects = osm.models.RepositorySO.getObjects(Repository);
  public objects = Repository.objects;

  public id = 0;
  public avatarUrl = "";
  public url = "";
  public name = "";
  public ownerId = 0;

  constructor(args: IRepository) {
    super();

    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.ownerId = args["ownerId"];
  }

  /**
   * Create a member within this repository.
   *
   * @param fields Member data
   * @returns {Member} A member object
   */
  createMember(fields: any): Member {
    let member = Member.objects.create({
      avatarUrl: fields.avatarUrl,
      url: fields.url,
      fullname: fields.fullname,
      username: fields.username,
      platformId: fields.platformId,
    });

    if (member.success === false) {
      member = Member.objects.filter({
        url: fields.url,
      })[0];
    }

    RepositoryHasMember.objects.create({
      repositoryId: this.id,
      memberId: member.id,
    });

    return member as Member;
  }

  /**
   * Create a language entry within this repository.
   *
   * @param fields Language data
   * @returns {Language} A language entry object
   */
  createLanguage(fields: any): Language {
    fields.repositoryId = this.id;

    let language = Language.objects.create(fields);

    return language as Language;
  }

  /**
   * Get all members within this repository.
   *
   * @returns {Member[]} A list of members object
   */
  getMembers(): Member[] {
    let members = RepositoryHasMember.objects.filter(
      {
        repositoryId: this.id,
      },
      Member
    );

    return members as Member[];
  }

  /**
   * Get the analysis of all language data of this repository.
   *
   * @returns {Language[]} A language evaluation object
   */
  getLanguages(): Language[] {
    let response = Language.objects.custom(
      Language.statements.byRepository(this.id)
    ) as Language[];

    return response;
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a repositoryHasMember object
 * @extends osm.models.RepositoryHasMemberSO Statement object
 */
class RepositoryHasMember extends osm.models.RepositoryHasMemberSO {
  public static objects = osm.models.RepositoryHasMemberSO.getObjects(
    RepositoryHasMember
  );

  public objects = RepositoryHasMember.objects;
  public id = 0;

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a language object
 * @extends osm.models.LanguageSO Statement object
 */
class Language extends osm.models.LanguageSO implements ILanguage {
  public static objects = osm.models.LanguageSO.getObjects(Language);
  public objects = Language.objects;

  public id = 0;
  public color = "";
  public name = "";
  public size = 0;
  public share = 0;
  public repositoryId = 0;

  constructor(args: ILanguage) {
    super();

    this.id = args["id"];
    this.color = args["color"];
    this.name = args["name"];
    this.size = args["size"];
    this.share = args["share"];
    this.repositoryId = args["repositoryId"];
  }

  /**
   * Get general language evaluation.
   *
   * @returns {Language[]} A list of language objects
   * @description Get a language analysis of all language data
   */
  static getLanguages(): Language[] {
    let response = this.objects.custom(
      Language.statements.merged
    ) as Language[];

    response = response.map((entry) => {
      return new Language(entry);
    });

    return response;
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a platformHasRepository object
 * @extends osm.models.PlatformHasRepositorySO Statement object
 */
class PlatformHasRepository extends osm.models.PlatformHasRepositorySO {
  public static objects = osm.models.PlatformHasRepositorySO.getObjects(
    PlatformHasRepository
  );

  public id = 0;
  public objects = PlatformHasRepository.objects;

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a organization object
 * @extends osm.models.OrganizationSO Statement object
 */
class Organization extends osm.models.OrganizationSO implements IOrganization {
  public static objects = osm.models.OrganizationSO.getObjects(Organization);
  public objects = Organization.objects;

  public id = 0;
  public avatarUrl = "";
  public url = "";
  public name = "";
  public fullname = "";
  public description = "";
  public platformName = "";

  constructor(args: IOrganization) {
    super();

    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.fullname = args["fullname"];
    this.description = args["description"];
    this.platformName = args["platformName"];
  }

  /**
   * Create a member within this organization.
   *
   * @param fields Member data
   * @returns {Member} A member object
   */
  createMember(fields: any): Member {
    let member = Member.objects.create({
      avatarUrl: fields.avatarUrl,
      url: fields.url,
      fullname: fields.fullname,
      username: fields.username,
      platformId: fields.platformId,
    });

    if (member.success === false) {
      member = Member.objects.filter({
        url: fields.url,
      })[0];
    }

    OrganizationHasMember.objects.create({
      organizationId: this.id,
      memberId: member.id,
    });

    return member as Member;
  }

  /**
   * Get all members within this organization.
   *
   * @returns {Member[]} A list of member objects
   */
  getMembers(): Member[] {
    let members = OrganizationHasMember.objects.filter(
      {
        organizationId: this.id,
      },
      Member
    );

    return members as Member[];
  }

  /**
   * Get all repositories which belongs to this organization.
   *
   * @returns {Repository[]} A list of repository objects
   */
  getRepositories(): Repository[] {
    let filterStatement = Repository.statements.withOwner;
    let response = this.objects.filter(
      { owner: this.name },
      Repository,
      filterStatement
    );

    return response as Repository[];
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a organizationHasMember object
 * @extends osm.models.OrganizationHasMemberSO Statement object
 */
class OrganizationHasMember extends osm.models.OrganizationHasMemberSO {
  public static objects = osm.models.OrganizationHasMemberSO.getObjects(
    OrganizationHasMember
  );
  public objects = OrganizationHasMember.objects;
  public id = 0;

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a organizationHasMember object
 * @extends osm.models.PlatformHasOrganizationSO Statement object
 */
class PlatformHasOrganization extends osm.models.PlatformHasOrganizationSO {
  public static objects = osm.models.PlatformHasOrganizationSO.getObjects(
    PlatformHasOrganization
  );

  public objects = PlatformHasOrganization.objects;
  public id = 0;

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a statistic object
 * @extends osm.models.StatisticSO Statement object
 */
class Statistic extends osm.models.StatisticSO implements IStatistic {
  public static objects = osm.models.StatisticSO.getObjects(Statistic);
  public objects = Statistic.objects;

  public id = 0;
  public year = 0;
  public totalIssueContributions = 0;
  public totalCommitContributions = 0;
  public totalRepositoryContributions = 0;
  public totalPullRequestContributions = 0;
  public totalPullRequestReviewContributions = 0;
  public totalRepositoriesWithContributedIssues = 0;
  public totalRepositoriesWithContributedCommits = 0;
  public totalRepositoriesWithContributedPullRequests = 0;
  public platformId = 0;

  constructor(args: IStatistic) {
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

  /**
   * Create a streak within this statistic.
   *
   * @param fields Streak data
   * @returns {Streak} A streak object
   */
  createStreak(fields: any): Streak {
    fields.statisticId = this.id;

    let streak = Streak.objects.create(fields);

    return streak as Streak;
  }

  /**
   * Get dates of statistic.
   * 
   * @returns {object} A object with from and to date
   * @description Get the correct from and to date. The calculation
   *              is based on wether this statistic is the current year or not.
   */
  getDates() {
    let from, to;

    if (this.year === 0) {
      from = moment().subtract(1, "years").day(0).format();
      to = moment().format();
    } else {
      from = moment().year(this.year).month(0).day(0).date(1).format();
      to = moment().year(this.year).month(11).day(31).format();
    }

    return {
      from,
      to,
    };
  }

  /**
   * Get all streaks within this statistic.
   *
   * @returns {Streak[]} A list of streaks
   */
  getStreaks(): Streak[] {
    if (this.year || this.year === 0) {
      let { from, to } = this.getDates();
      let response = Calendar.getDaysBetweenDate({
        from,
        to,
      });

      response = helper.statistic.calculateStreaks(response);
      response = response.map((entry: any) => {
        return new Streak(entry);
      });

      return response as Streak[];
    }

    return [];
  }

  /**
   * Get streak details.
   *
   * @param streaks A list of streaks
   * @returns {object} Current and longest streak object
   * @description Calculate the current and longest streak of a list of streaks
   */
  getStreakDetail(streaks: Streak[]) {
    /**
     * @todo Error handling
     */
    let longest: Streak = streaks[0];
    let current: Streak = new Streak({
      id: -1,
      startDate: "-",
      endDate: "-",
      totalDays: 0,
      totalContributions: 0,
      statisticId: 0,
    });

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
      current,
    };
  }

  /**
   * Get the busiest day.
   *
   * @returns {Calendar} A calendar object
   * @description Get the entry with the most contributions per day within
   * the date range of this statistic.
   */
  getBusiestDay(): Calendar {
    if (this.year || this.year === 0) {
      let { from, to } = this.getDates();
      let response = Calendar.getBusiestDay({
        from,
        to,
      });

      if (response) {
        return new Calendar(response);
      }
    }

    /* Create empty calendar entry for busiest day, if there is no real busiest day */
    return new Calendar({
      id: -1,
      date: "",
      total: 0,
      platformId: -1,
    });
  }

  /**
   * Get all contributions.
   *
   * @returns {object} A contribution type statistic object
   * @description Get a merged contribution over all platforms within this statistic year
   */
  getContributions() {
    let response = Statistic.getContributions(this);

    return response;
  }

  /**
   * Get merged statistic.
   *
   * @returns {Statistic[]} A list of merged statistic years object
   * @description Get a list of statistic years from merged data of all platforms
   */
  static getMerged(): Statistic[] {
    return super.getMerged(Statistic) as Statistic[];
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a streak object
 * @extends osm.models.StreakSO Statement object
 */
class Streak extends osm.models.StreakSO implements IStreak {
  public static objects = osm.models.StreakSO.getObjects(Streak);
  public objects = Streak.objects;

  public id = 0;
  public startDate = "";
  public endDate = "";
  public totalDays = 0;
  public totalContributions = 0;
  public statisticId = 0;

  constructor(args: IStreak) {
    super();

    this.id = args["id"];
    this.startDate = args["startDate"];
    this.endDate = args["endDate"];
    this.totalDays = args["totalDays"];
    this.totalContributions = args["totalContributions"];
    this.statisticId = args["statisticId"];
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a calendar object
 * @extends osm.models.CalendarSO Statement object
 */
class Calendar extends osm.models.CalendarSO implements ICalendar {
  public static objects = osm.models.CalendarSO.getObjects(Calendar);
  public objects = Calendar.objects;

  public id = 0;
  public date = "";
  public total = 0;
  public platformId = 0;

  constructor(args: ICalendar) {
    super();

    this.id = args["id"];
    this.date = args["date"];
    this.total = args["total"];
    this.platformId = args["platformId"];
  }

  /**
   * Create a contribution within this calendar entry.
   *
   * @param fields Contribution data
   * @returns {Contribution} A contribution object
   */
  createContribution(fields: any): Contribution {
    let contribution = Contribution.objects.create({
      repoUrl: fields.repoUrl,
      datetime: fields.datetime,
      nameWithOwner: fields.nameWithOwner,
      type: fields.type,
      calendarId: this.id,
    });

    return contribution as Contribution;
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a contribution object
 * @extends osm.models.ContributionSO Statement object
 */
class Contribution extends osm.models.ContributionSO implements IContribution {
  public static objects = osm.models.ContributionSO.getObjects(Contribution);
  public objects = Contribution.objects;

  public id = 0;
  public repoUrl = "";
  public datetime = "";
  public nameWithOwner = "";
  public type = "";
  public calendarId = 0;

  constructor(args: IContribution) {
    super();

    this.id = args["id"];
    this.repoUrl = args["repoUrl"];
    this.datetime = args["datetime"];
    this.nameWithOwner = args["nameWithOwner"];
    this.type = args["type"];
    this.calendarId = args["calendarId"];
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this osm model
   */
  save() {}
}

/**
 * @class A OSM model for a talk object
 * @extends osm.models.TalkSO Statement object
 */
class Talk extends osm.models.TalkSO implements ITalk {
  public static objects = osm.models.TalkSO.getObjects(Talk);
  public objects = Talk.objects;

  public id = 0;
  public name = "";
  public url = "";
  public displayUrl = "";
  public downloadUrl = "";
  public path = "";
  public repositoryData = "";

  constructor(args: ITalk) {
    super();

    this.id = args["id"];
    this.name = args["name"];
    this.url = args["url"];
    this.displayUrl = args["displayUrl"];
    this.downloadUrl = args["downloadUrl"];
    this.path = args["path"];
    this.repositoryData = args["repositoryData"];
  }

  getRepository(): Repository {
    try {
      /* Parse repositoryData to a object */
      let repositoryData = JSON.parse(this.repositoryData);

      /* Filter repositories for repository represented by repositoryData */
      const repository: any = Repository.objects.filter({
        url: repositoryData.url,
      })[0];

      if (repository) {
        repository.owner = Member.objects.get({
          id: repository.ownerId,
        }) as Member;

        repository.owner.render([]);

        /* Return the existing repository from the database */
        return repository;
      } else {
        /* Return a new repository created with repositoryData */
        let repository: any = new Repository(repositoryData);

        repository.owner = new Member(repositoryData.owner);

        return repository;
      }
    } catch (ex) {
      console.warn(
        ex +
          "De-serialization of repositoryData failed, " +
          "therefore an empty repository is provided!"
      );

      const repositoryData: any = {};

      return new Repository(repositoryData);
    }
  }

  /**
   * @todo Implement a save functionality
   * @description Saves this statement object to the database
   */
  save() {}
}
//#endregion

//#region > Exports
export {
  Platform,
  Statistic,
  Contribution,
  Repository,
  Language,
  Organization,
  Member,
  RepositoryHasMember,
  Streak,
  Calendar,
  Talk,
};
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
