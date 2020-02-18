import * as osm from "./osm";
import moment, { lang } from "moment";
// import * as helper from "./helper";
import * as helper from "./helper";

class Platform extends osm.models.PlatformSO {
  static objects = this.getObjects(this);

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

  createRepository(fields) {
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

  createOrganization(fields) {
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

  createStatistic(fields) {
    fields.platform_id = this.id;
    let statistic = Statistic.objects.create(fields);

    return statistic;
  }

  createCalendarEntry(fields) {
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
  getCalendar(dates) {
    Calendar.getCalendar(dates);
  }

  getActivity() {
    return Calendar.getActivity();
  }
}

class Member extends osm.models.MemberSO {
  static objects = this.getObjects(this);

  constructor(args) {
    super();
    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.fullname = args["fullname"];
    this.username = args["username"];
    this.platform_id = args["platform_id"];
  }
}

class Repository extends osm.models.RepositorySO {
  static objects = this.getObjects(this);

  constructor(args) {
    super();
    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.owner_id = args["owner_id"];
  }

  createMember(fields) {
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

  createLanguage(fields) {
    fields.repository_id = this.id;
    let language = Language.objects.create(fields);

    return language;
  }

  getMembers() {
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
  static objects = this.getObjects(this);
}

class Language extends osm.models.LanguageSO {
  static objects = this.getObjects(this);

  constructor(args) {
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
    response = response.map(entry => {
      return new Language(entry);
    });
    return response;
  }
}

class PlatformHasRepository extends osm.models.PlatformHasRepositorySO {
  static objects = this.getObjects(this);
}

class Organization extends osm.models.OrganizationSO {
  static objects = this.getObjects(this);

  constructor(args) {
    super();
    this.id = args["id"];
    this.avatarUrl = args["avatarUrl"];
    this.url = args["url"];
    this.name = args["name"];
    this.fullname = args["fullname"];

    this.member = Member;
  }

  createMember(fields) {
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
  static objects = this.getObjects(this);
}

class PlatformHasOrganization extends osm.models.PlatformHasOrganizationSO {
  static objects = this.getObjects(this);
}

class Statistic extends osm.models.StatisticSO {
  static objects = this.getObjects(this);

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
    this.platform_id = args["platform_id"];
  }

  createStreak(fields) {
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
    }
  }

  getStreaks() {
    console.log(this.year)
    if (this.year || this.year === 0) {
      console.log(this.year)

      let { from , to} = this.getDates();
      let response = Calendar.getDaysBetweenDate(this, {
        from,
        to
      });

      // response.push({date: "2019-12-01", total:5})
      // response.push({date: "2019-12-02", total:55})
      // response.push({date: "2019-12-03", total:5})

      response = helper.statistic.calculateStreaks(response);
      response = response.map(entry => {
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

    streaks.forEach(streak => {
      if(streak.totalDays >= longest.totalDays){
        longest = streak;
      }

      if(moment().diff(streak.endDate, "days") === 0){
        current = streak;
      }
    })

    return {
      longest,
      current
    };
  }

  getBusiestDay() {
    if (this.year || this.year === 0) {

      let { from , to} = this.getDates();
      let response = Calendar.getBusiestDay({
        from,
        to
      });
      if(response){
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

class Streak extends osm.models.StreakSO {
  static objects = this.getObjects(this);

  constructor(args) {
    super();
    this.id = args["id"];
    this.startDate = args["startDate"];
    this.endDate = args["endDate"];
    this.totalDays = args["totalDays"];
    this.totalContributions = args["totalContributions"];
    this.statistic_id = args["statistic_id"];
  }
}

class Calendar extends osm.models.CalendarSO {
  static objects = this.getObjects(this);

  constructor(args) {
    super();
    this.id = args["id"];
    this.date = args["date"];
    this.total = args["total"];
    this.platform_id = args["platform_id"];
  }

  createContribution(fields) {
    let contribution = Contribution.objects.create({
      id: fields.id,
      repoUrl: fields.repoUrl,
      datetime: fields.datetime,
      nameWithOwner: fields.nameWithOwner,
      type: fields.type,
      calendar_id: this.id
    });

    return contribution;
  }
}

class Contribution extends osm.models.ContributionSO {
  static objects = this.getObjects(this);

  constructor(args) {
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
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
