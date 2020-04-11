//> Imports
// Contains all statement objects.
import * as osm from "./osm";
// Contains helper functions for the models.
import * as helper from "./helper";
// Contains a lightweight framework for time management.
import moment from "moment";

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

/**
 * @class A platform model.
 * @extends osm.models.PlatformSO Statement object.
 */
class Platform extends osm.models.PlatformSO implements IPlatform {
  public static objects = osm.models.PlatformSO.getObjects(Platform);

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
   * Create a repository.
   *
   * @param fields Repository data.
   * @returns {Repository} A repository object.
   * @description Creates a repository within this platform.
   */
  createRepository(fields: any): Repository {
    let repository = Repository.objects.create(fields);
    if (repository.success === false) {
      repository = Repository.objects.filter({
        url: fields.url,
      })[0];
    }
    PlatformHasRepository.objects.create({
      platform_id: this.id,
      repository_id: repository.id,
    });
    return repository as Repository;
  }

  /**
   * Create a organization.
   *
   * @param fields Organization data.
   * @returns {Organization} A organization.
   * @description Creates a organization within this platform.
   */
  createOrganization(fields: any): Organization {
    let organization = Organization.objects.create(fields);
    if (organization.success === false) {
      organization = Organization.objects.filter({
        url: fields.url,
      })[0];
    }

    PlatformHasOrganization.objects.create({
      platform_id: this.id,
      organization_id: organization.id,
    });
    return organization as Organization;
  }

  /**
   * Create a organization.
   *
   * @param fields Statistic data.
   * @returns {Statistic} A statistic.
   * @description Creates a statistic of a year within this platform.
   */
  createStatistic(fields: any): Statistic {
    fields.platform_id = this.id;
    let statistic = Statistic.objects.create(fields);

    return statistic as Statistic;
  }

  /**
   * Create a calendar entry.
   *
   * @param fields Calendar entry data.
   * @returns {Statistic} A calendar entry.
   * @description Create a day of a calendar with the given fields within this platform.
   */
  createCalendarEntry(fields: any): Calendar {
    fields.platform_id = this.id;
    let calendar = Calendar.objects.create(fields);

    return calendar as Calendar;
  }

  /**
   * Get all repositories.
   *
   * @returns {Repository[]} A list of repositories.
   * @description Get all repositories within this platform.
   */
  getRepositories(): Repository[] {
    let repositories = PlatformHasRepository.objects.filter(
      {
        platform_id: this.id,
      },
      Repository
    );

    return repositories as Repository[];
  }

  /**
   * Get all organizations.
   *
   * @returns {Organization[]} A list of organizations.
   * @description Get all organizations within this platform.
   */
  getOrganizations(): Organization[] {
    let organizations = PlatformHasOrganization.objects.filter(
      {
        platform_id: this.id,
      },
      Organization
    );

    return organizations as Organization[];
  }

  /**
   * Get a calendar.
   *
   * @returns A contribution calendar.
   * @description Get a merged contribution calendar from all platform data.
   */
  getCalendar(dates: any) {
    let response = Calendar.getCalendar(dates);
    return response.data;
  }
}

interface IMember {
  id: number;
  avatarUrl: string;
  url: string;
  fullname: string;
  username: string;
  platform_id: number;
}

/**
 * @class A member model.
 * @extends osm.models.MemberSO Statement object.
 */
class Member extends osm.models.MemberSO {
  public static objects = osm.models.MemberSO.getObjects(Member);

  public id = 0;
  public avatarUrl = "";
  public url = "";
  public fullname = "";
  public username = "";
  public platform_id = 0;

  constructor(args: IMember) {
    super();
    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.fullname = args["fullname"];
    this.username = args["username"];
    this.platform_id = args["platform_id"];
  }
}

interface IRepository {
  id: number;
  avatarUrl: string;
  url: string;
  name: string;
  owner_id: number;
}

/**
 * @class A repository model.
 * @extends osm.models.RepositorySO Statement object.
 */
class Repository extends osm.models.RepositorySO implements IRepository {
  public static objects = osm.models.RepositorySO.getObjects(Repository);

  public id = 0;
  public avatarUrl = "";
  public url = "";
  public name = "";
  public owner_id = 0;

  constructor(args: IRepository) {
    super();
    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.owner_id = args["owner_id"];
  }

  /**
   * Create a member.
   *
   * @param fields Member data.
   * @returns {Member} A member.
   * @description Create a member within this repository.
   */
  createMember(fields: any): Member {
    let member = Member.objects.create({
      avatarUrl: fields.avatarUrl,
      url: fields.url,
      fullname: fields.fullname,
      username: fields.username,
      platform_id: fields.platform_id,
    });
    if (member.success === false) {
      member = Member.objects.filter({
        username: fields.username,
        platform_id: fields.platform_id,
      })[0];
    }
    RepositoryHasMember.objects.create({
      repository_id: this.id,
      member_id: member.id,
    });

    return member as Member;
  }

  /**
   * Create a language entry.
   *
   * @param fields Language data.
   * @returns {Language} A language entry.
   * @description Create a language entry within this repository.
   */
  createLanguage(fields: any): Language {
    fields.repository_id = this.id;
    let language = Language.objects.create(fields);

    return language as Language;
  }

  /**
   * Get all members.
   *
   * @returns {Member[]} A list of members.
   * @description Get all members within this repository.
   */
  getMembers(): Member[] {
    let members = RepositoryHasMember.objects.filter(
      {
        repository_id: this.id,
      },
      Member
    );

    return members as Member[];
  }

  /**
   * Get language evaluation.
   *
   * @returns {Langage[]} A language evaluation.
   * @description Get the analysis of all language data of this repository.
   */
  getLanguages(): Language[] {
    return super.getLanguages(Language, this) as Language[];
  }
}

/**
 * @class A repositoryHasMember model.
 * @extends osm.models.RepositoryHasMemberSO Statement object.
 */
class RepositoryHasMember extends osm.models.RepositoryHasMemberSO {
  public static objects = osm.models.RepositoryHasMemberSO.getObjects(
    RepositoryHasMember
  );
}

interface ILanguage {
  id: number;
  color: string;
  name: string;
  size: number;
  share: number;
  repository_id: number;
}

/**
 * @class A language model.
 * @extends osm.models.LanguageSO Statement object.
 */
class Language extends osm.models.LanguageSO implements ILanguage {
  public static objects = osm.models.LanguageSO.getObjects(Language);

  public id = 0;
  public color = "";
  public name = "";
  public size = 0;
  public share = 0;
  public repository_id = 0;

  constructor(args: ILanguage) {
    super();
    this.id = args["id"];
    this.color = args["color"];
    this.name = args["name"];
    this.size = args["size"];
    this.share = args["share"];
    this.repository_id = args["repository_id"];
  }

  /**
   * Get general language evaluation.
   *
   * @returns {Language[]} A list of language entries.
   * @description Get a language analysis of all language data.
   */
  static getLanguages() : Language[] {
    let response = super.getLanguages() as Language[];
    response = response.map((entry) => {
      return new Language(entry);
    });
    return response;
  }
}

/**
 * @class A platformHasRepository model.
 * @extends osm.models.PlatformHasRepositorySO Statement object.
 */
class PlatformHasRepository extends osm.models.PlatformHasRepositorySO {
  public static objects = osm.models.PlatformHasRepositorySO.getObjects(
    PlatformHasRepository
  );
}

interface IOrganization {
  id: number;
  avatarUrl: string;
  url: string;
  name: string;
  fullname: string;
}

/**
 * @class A organization model.
 * @extends osm.models.OrganizationSO Statement object.
 */
class Organization extends osm.models.OrganizationSO implements IOrganization {
  public static objects = osm.models.OrganizationSO.getObjects(Organization);

  public id = 0;
  public avatarUrl = "";
  public url = "";
  public name = "";
  public fullname = "";

  constructor(args: IOrganization) {
    super();
    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.fullname = args["fullname"];
  }

  /**
   * Create a member.
   *
   * @param fields Member data.
   * @returns {Member} A member.
   * @description Create a member within this organization.
   */
  createMember(fields: any): Member {
    let member = Member.objects.create({
      avatarUrl: fields.avatarUrl,
      url: fields.url,
      fullname: fields.fullname,
      username: fields.username,
      platform_id: fields.platform_id,
    });

    if (member.success === false) {
      member = Member.objects.filter({
        username: fields.username,
        platform_id: fields.platform_id,
      })[0];
    }
    OrganizationHasMember.objects.create({
      organization_id: this.id,
      member_id: member.id,
    });
    return member as Member;
  }

  /**
   * Get all members.
   *
   * @returns {Member[]} A list of members.
   * @description Get all members within this organization.
   */
  getMembers(): Member[] {
    let members = OrganizationHasMember.objects.filter(
      {
        organization_id: this.id,
      },
      Member
    );

    return members as Member[];
  }

  /**
   * Get all repositories.
   *
   * @returns {Repository[]} A list of repositories.
   * @description Get all repositories which belongs to this organization.
   */
  getRepositories(): Repository[] {
    return super.getRepositories(Repository, this) as Repository[];
  }
}

/**
 * @class A organizationHasMember model.
 * @extends osm.models.OrganizationHasMemberSO Statement object.
 */
class OrganizationHasMember extends osm.models.OrganizationHasMemberSO {
  public static objects = osm.models.OrganizationHasMemberSO.getObjects(
    OrganizationHasMember
  );
}

/**
 * @class A platformHasOrganization model.
 * @extends osm.models.PlatformHasOrganizationSO Statement object.
 */
class PlatformHasOrganization extends osm.models.PlatformHasOrganizationSO {
  public static objects = osm.models.PlatformHasOrganizationSO.getObjects(
    PlatformHasOrganization
  );
}

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
  platform_id: number;
}

/**
 * @class A statistic model.
 * @extends osm.models.StatisticSO Statement object.
 */
class Statistic extends osm.models.StatisticSO implements IStatistic {
  public static objects = osm.models.StatisticSO.getObjects(Statistic);

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
  public platform_id = 0;

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
    this.platform_id = args["platform_id"];
  }

  /**
   * Create streak.
   *
   * @param fields Streak data.
   * @returns {Streak} A streak.
   * @description Create a streak within this statistic.
   */
  createStreak(fields: any): Streak {
    fields.statistic_id = this.id;

    let streak = Streak.objects.create(fields);

    return streak as Streak;
  }

  /**
   * Get dates of statistic.
   * @returns From and to date.
   * @description Get the correct from and to date.
   * The calculation is based of wether this statistic is the current year or not.
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
   * Get all streaks.
   *
   * @returns {Streak[]} A list of streaks.
   * @description Get all streaks within this statistic.
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
   * @param streaks A list of streaks.
   * @returns Current and longest streak.
   * @description Calculate the current and longest streak of a list of streaks.
   */
  getStreakDetail(streaks: Streak[]) {
    /**
     * @todo Error handling.
     */
    let longest: Streak = streaks[0];
    let current: Streak = new Streak({
      id: -1,
      startDate: "-",
      endDate: "-",
      totalDays: 0,
      totalContributions: 0,
      statistic_id: 0,
    });
    // let current = {};

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
   * @returns {Calendar} A calendar entry.
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
    /**
     * Create empty calendar entry for busiest day if there is no real busiest day.
     */
    return new Calendar({
      id: -1,
      date: "",
      total: 0,
      platform_id: -1,
    });
  }

  /**
   * Get all contributions.
   *
   * @returns A contribtion type statistic.
   * @description Get a merged contribution over all platforms whithin this statstic year.
   */
  getContributions() {
    let response = super.getContributions(this);
    if (response) {
      return response;
    }
    return { commit: 0, issue: 0, pullRequest: 0, pullRequestReview: 0 };
  }

  /**
   * Get merged statistic.
   *
   * @returns {Statistic[]} A list of merged statistic years.
   * @description Get a list of statistic years from merged data of all platforms.
   */
  static getMerged(): Statistic[] {
    return super.getMerged(Statistic) as Statistic[];
  }
}

interface IStreak {
  id: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalContributions: number;
  statistic_id: number;
}

/**
 * @class A streak model.
 * @extends osm.models.StreakSO Statement object.
 */
class Streak extends osm.models.StreakSO implements IStreak {
  public static objects = osm.models.StreakSO.getObjects(Streak);

  public id = 0;
  public startDate = "";
  public endDate = "";
  public totalDays = 0;
  public totalContributions = 0;
  public statistic_id = 0;

  constructor(args: IStreak) {
    super();
    this.id = args["id"];
    this.startDate = args["startDate"];
    this.endDate = args["endDate"];
    this.totalDays = args["totalDays"];
    this.totalContributions = args["totalContributions"];
    this.statistic_id = args["statistic_id"];
  }
}

interface ICalendar {
  id: number;
  date: string;
  total: number;
  platform_id: number;
}

/**
 * @class A calendar model.
 * @extends osm.models.CalendarSO Statement object.
 */
class Calendar extends osm.models.CalendarSO implements ICalendar {
  public static objects = osm.models.CalendarSO.getObjects(Calendar);

  public id = 0;
  public date = "";
  public total = 0;
  public platform_id = 0;

  constructor(args: ICalendar) {
    super();
    this.id = args["id"];
    this.date = args["date"];
    this.total = args["total"];
    this.platform_id = args["platform_id"];
  }

  /**
   * Create a contribution.
   *
   * @param fields Contribution data.
   * @returns {Contribution} A contribution.
   * @description Create a contribution within this calendar entry.
   */
  createContribution(fields: any): Contribution {
    let contribution = Contribution.objects.create({
      repoUrl: fields.repoUrl,
      datetime: fields.datetime,
      nameWithOwner: fields.nameWithOwner,
      type: fields.type,
      calendar_id: this.id,
    });

    return contribution as Contribution;
  }
}

interface IContribution {
  id: number;
  repoUrl: string;
  datetime: string;
  nameWithOwner: string;
  type: string;
  calendar_id: number;
}

/**
 * @class A contribution model.
 * @extends osm.models.ContributionSO Statement object.
 */
class Contribution extends osm.models.ContributionSO implements IContribution {
  public static objects = osm.models.ContributionSO.getObjects(Contribution);

  public id = 0;
  public repoUrl = "";
  public datetime = "";
  public nameWithOwner = "";
  public type = "";
  public calendar_id = 0;

  constructor(args: IContribution) {
    super();
    this.id = args["id"];
    this.repoUrl = args["repoUrl"];
    this.datetime = args["datetime"];
    this.nameWithOwner = args["nameWithOwner"];
    this.type = args["type"];
    this.calendar_id = args["calendar_id"];
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
  Streak,
  Calendar,
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
