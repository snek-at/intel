import * as osm from "./osm";
import moment from "moment";
// import * as helper from "./helper";
import * as helper from "./helper";

export interface IPlatform {
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

  createRepository(fields: any) {
    let repository = Repository.objects.create(fields);
    if (repository.success === false) {
      repository = Repository.objects.filter({
        url: fields.url
      })[0];
    }
    PlatformHasRepository.objects.create(
      {
        platform_id: this.id,
        repository_id: repository.id
      },
      Repository
    );
    return repository;
  }

  createOrganization(fields: any) {
    let organization = Organization.objects.create(fields);
    if (organization.success === false) {
      organization = Organization.objects.filter({
        url: fields.url
      })[0];
    }

    PlatformHasOrganization.objects.create(
      {
        platform_id: this.id,
        organization_id: organization.id
      },
      Organization
    );
    return organization;
  }

  createStatistic(fields: any) {
    fields.platform_id = this.id;
    let statistic = Statistic.objects.create(fields);

    return statistic;
  }

  createCalendarEntry(fields: any) {
    fields.platform_id = this.id;
    let calendar = Calendar.objects.create(fields);

    return calendar;
  }

  getRepositories() {
    let repositories = PlatformHasRepository.objects.filter(
      {
        platform_id: this.id
      },
      Repository
    );

    return repositories;
  }

  getOrganizations() {
    let organizations = PlatformHasOrganization.objects.filter(
      {
        platform_id: this.id
      },
      Organization
    );

    return organizations;
  }
  // Implement calendar by platform
  getCalendar(dates: any) {
    Calendar.getCalendar(dates);
  }
}

export interface IMember {
  id: number;
  avatarUrl: string;
  url: string;
  fullname: string;
  username: string;
  platform_id: number;
}

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

  createMember(fields: any) {
    let member = Member.objects.create({
      avatarUrl: fields.avatarUrl,
      url: fields.url,
      fullname: fields.fullname,
      username: fields.username,
      platform_id: fields.platform_id
    });
    if (member.success === false) {
      member = Member.objects.filter({
        username: fields.username,
        platform_id: fields.platform_id
      })[0];
    }
    RepositoryHasMember.objects.create({
      repository_id: this.id,
      member_id: member.id
    });

    return member;
  }

  createLanguage(fields: any) {
    fields.repository_id = this.id;
    let language = Language.objects.create(fields);

    return language;
  }

  getMembers() : Member[] {
    let members = RepositoryHasMember.objects.filter(
      {
        repository_id: this.id
      },
      Member
    );

    return members;
  }

  getLanguages() {
    return super.getLanguages(Language, this);
  }
}

class RepositoryHasMember extends osm.models.RepositoryHasMemberSO {
  public static objects = osm.models.RepositoryHasMemberSO.getObjects(RepositoryHasMember);
}

export interface ILanguage {
  id: number;
  color: string;
  name: string;
  size: number;
  share: number;
  repository_id: number;
}

class Language extends osm.models.LanguageSO implements ILanguage{
  public static objects = osm.models.LanguageSO.getObjects(Language);

  public id = 0;
  public color = "";
  public name = "";
  public size = 0;
  public share = 0;
  public repository_id = 0;

  constructor(args:ILanguage) {
    super();
    this.id = args["id"];
    this.color = args["color"];
    this.name = args["name"];
    this.size = args["size"];
    this.share = args["share"];
    this.repository_id = args["repository_id"];
  }

  static getLanguages() {
    let response = super.getLanguages();
    response = response.map((entry:any) => {
      return new Language(entry);
    });
    return response;
  }
}

class PlatformHasRepository extends osm.models.PlatformHasRepositorySO {
  public static objects = osm.models.PlatformHasRepositorySO.getObjects(PlatformHasRepository);
}

interface IOrganization {
  id: number;
  avatarUrl: string;
  url: string;
  name: string;
  fullname: string;
}

class Organization extends osm.models.OrganizationSO implements IOrganization {
  public static objects = osm.models.OrganizationSO.getObjects(Organization);

  public id = 0;
  public avatarUrl = "";
  public url = "";
  public name = "";
  public fullname = "";

  constructor(args:any) {
    super();
    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.fullname = args["fullname"];
  }

  createMember(fields:any) {
    let member = Member.objects.create({
      avatarUrl: fields.avatarUrl,
      url: fields.url,
      fullname: fields.fullname,
      username: fields.username,
      platform_id: fields.platform_id
    });

    if (member.success === false) {
      member = Member.objects.filter({
        username: fields.username,
        platform_id: fields.platform_id
      })[0];
    }
    OrganizationHasMember.objects.create({
      organization_id: this.id,
      member_id: member.id
    });
    return member;
  }

  getMembers() {
    let members = OrganizationHasMember.objects.filter(
      {
        organization_id: this.id
      },
      Member
    );

    return members;
  }

  getRepositories() {
    return super.getRepositories(Repository, this);
  }
}

class OrganizationHasMember extends osm.models.OrganizationHasMemberSO {
  public static objects = osm.models.OrganizationHasMemberSO.getObjects(OrganizationHasMember);
}

class PlatformHasOrganization extends osm.models.PlatformHasOrganizationSO {
  public static objects = osm.models.PlatformHasOrganizationSO.getObjects(PlatformHasOrganization);
}

interface IStatistic{
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

class Statistic extends osm.models.StatisticSO implements IStatistic{
  public static objects = osm.models.StatisticSO.getObjects(Statistic);

  public id = 0;
  public year = 0;
  public totalIssueContributions = 0;
  public totalCommitContributions = 0;
  public totalRepositoryContributions = 0;
  public totalPullRequestContributions = 0;
  public totalPullRequestReviewContributions = 0;
  public totalRepositoriesWithContributedIssues = 0;;
  public totalRepositoriesWithContributedCommits = 0;;
  public totalRepositoriesWithContributedPullRequests = 0;
  public platform_id = 0;

  constructor(args:any) {
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

  createStreak(fields:any) {
    fields.statistic_id = this.id;

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
      let response = Calendar.getDaysBetweenDate({
        from,
        to
      });

      response = helper.statistic.calculateStreaks(response);
      response = response.map((entry: any) => {
        return new Streak(entry);
      });
      return response;
    }
    return [];
  }

  getStreakDetail(streaks: any) {
    let longest = {
      totalDays: 0
    };
    let current = {};

    streaks.forEach((streak: any) => {
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

interface IStreak {
  id: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalContributions: number;
  statistic_id: number;
}

class Streak extends osm.models.StreakSO implements IStreak {
  public static objects = osm.models.StreakSO.getObjects(Streak);

  public id = 0;
  public startDate = "";
  public endDate = "";
  public totalDays = 0;
  public totalContributions = 0;
  public statistic_id = 0;

  constructor(args:any) {
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

class Calendar extends osm.models.CalendarSO implements ICalendar {
  public static objects = osm.models.CalendarSO.getObjects(Calendar);

  public id = 0;
  public date = "";
  public total = 0;
  public platform_id = 0;

  constructor(args:any) {
    super();
    this.id = args["id"];
    this.date = args["date"];
    this.total = args["total"];
    this.platform_id = args["platform_id"];
  }

  createContribution(fields:any) {
    let contribution = Contribution.objects.create({
      repoUrl: fields.repoUrl,
      datetime: fields.datetime,
      nameWithOwner: fields.nameWithOwner,
      type: fields.type,
      calendar_id: this.id
    });

    return contribution;
  }
}

interface IContribution {
  id: number;
  repoUrl: string;
  datetime: string;
  nameWithOwner: string;
  type: string;
  calendar_id: number
}

class Contribution extends osm.models.ContributionSO implements IContribution{
  public static objects = osm.models.ContributionSO.getObjects(Contribution);

  public id = 0;
  public repoUrl = "";
  public datetime = "";
  public nameWithOwner = "";
  public type = "";
  public calendar_id = 0;

  constructor(args:any) {
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
  Calendar
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
