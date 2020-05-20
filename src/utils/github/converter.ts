//#region > Imports
//# PACKAGE "moment"
//## npm install "moment"@2.25.3
// A lightweight JavaScript date library for parsing,
// validating, manipulating, and formatting dates.
import moment from "moment";

//> Models
// Contains all reducer database models
import * as models from "../../reducer/database/models";
//> Delay
// Contains a Delay function for timeouts
import Delay from "../../toolbox/Delay";
//#endregion

//#region > Functions
/**
 * Converter for data from the github api.
 *
 * @param rawData
 * @description Fill the database with data provided by "rawData"
 */
async function run(rawData: any) {
  let platform = models.Platform.objects.create({
    platformName: "github",
    platformUrl: "https://github.com",
    avatarUrl: rawData.profile.avatarUrl,
    websiteUrl: rawData.profile.websiteUrl,
    company: rawData.profile.company,
    email: rawData.profile.email,
    username: rawData.profile.login,
    fullName: rawData.profile.name,
    createdAt: rawData.profile.createdAt,
    location: rawData.profile.location,
    statusMessage: rawData.profile.status?.message,
    statusEmojiHTML: rawData.profile.status?.emojiHTML,
  }) as models.Platform;

  rawData.profile.organizations.edges.forEach((edge: any) => {
    if (edge.node) {
      let organization: models.Organization;

      organization = platform.createOrganization({
        avatarUrl: edge.node.avatarUrl,
        url: edge.node.url,
        name: edge.node.login,
        fullname: edge.node.name,
        description: edge.node.description,
      });

      edge.node.membersWithRole.nodes.forEach((node: any) => {
        organization.createMember({
          avatarUrl: node.avatarUrl,
          url: node.url,
          fullname: node.name,
          username: node.login,
          platformId: platform.id,
        });
      });
    }
  });

  /** @todo Store repositories with key: nameWithOwner in order to prevent duplicates */

  let repositories: any = {};

  // Calendar
  for (let [index, yearObject] of Object.entries(rawData.calendar)) {
    await Delay(300);
    /*
      Set type of year because it is not possible in the loop declaration.
      This is required because of the type of yearIndex which is unknown.
    */
    let year = yearObject as any;

    if (index !== "__typename") {
      let yearCount = "0";

      if (index !== "current") {
        yearCount = index.split("T")[1];
        year.contributionCalendar.weeks.forEach((week: any) => {
          week.contributionDays.forEach((day: any) => {
            if (day.contributionCount > 0) {
              // Insert Calendar days
              platform.createCalendarEntry({
                date: moment(day.date).format("YYYY-MM-DD"),
                total: day.contributionCount,
              });
            }
          });
        });

        // Store Repositories in variable
        year.commitContributionsByRepository.forEach((node: any) => {
          repositories[node.repository.nameWithOwner] = node.repository;
        });
        year.issueContributionsByRepository.forEach((node: any) => {
          repositories[node.repository.nameWithOwner] = node.repository;
        });
        year.pullRequestContributionsByRepository.forEach((node: any) => {
          repositories[node.repository.nameWithOwner] = node.repository;
        });
      }

      platform.createStatistic({
        year: yearCount,
        totalIssueContributions: year.totalIssueContributions,
        totalCommitContributions: year.totalCommitContributions,
        totalRepositoryContributions: year.totalRepositoryContributions,
        totalPullRequestContributions: year.totalPullRequestContributions,
        totalPullRequestReviewContributions:
          year.totalPullRequestReviewContributions,
        totalRepositoriesWithContributedIssues:
          year.totalRepositoriesWithContributedIssues,
        totalRepositoriesWithContributedCommits:
          year.totalRepositoriesWithContributedCommits,
        totalRepositoriesWithContributedPullRequests:
          year.totalRepositoriesWithContributedPullRequests,
      });
    }
  }

  // Process Repositories
  Object.values(repositories).forEach((node: any) => {
    // Create repository owner
    let owner = models.Member.objects.create({
      avatarUrl: node.owner.avatarUrl,
      url: node.owner.url,
      fullname: node.owner.login, // Fullname is not present
      username: node.owner.login,
      platformId: platform.id,
    });

    if (owner.success === false) {
      owner = models.Member.objects.filter({
        url: node.owner.url,
      })[0];
    }

    let repository = platform.createRepository({
      avatarUrl: node.openGraphImageUrl,
      url: node.url,
      name: node.nameWithOwner,
      ownerId: owner.id,
    });

    node.assignableUsers.nodes.forEach((member: any) => {
      repository.createMember({
        avatarUrl: member.avatarUrl,
        url: member.url,
        fullname: member.name,
        username: member.login,
        platformId: platform.id,
      });
    });

    node.languages.edges.forEach((edge: any) => {
      repository.createLanguage({
        color: edge.node.color,
        name: edge.node.name,
        size: edge.size,
      });
    });
  });
}
//#endregion

//#region > Exports
export { run };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
