//#region > Imports
//> GQL
// DocumentNode needed for queries
import { gql } from "apollo-boost";
//#endregion

//#region > Queries
const profile = () => gql`
  query profile($username: String!) {
    user(login: $username) {
      avatarUrl
      company
      createdAt
      name
      login
      email
      websiteUrl
      hovercard {
        contexts {
          message
          octicon
        }
      }
      isEmployee
      isHireable
      location
      status {
        emojiHTML
        message
      }
      organizations(first: 100) {
        edges {
          node {
            name
            login
            url
            avatarUrl
            name
            membersWithRole(first: 100) {
              totalCount
              nodes {
                name
                login
                avatarUrl
                url
                projectsUrl
              }
            }
          }
        }
      }
    }
  }
`;

const calendar = (fragments: string) => gql`
  query calendar ($username: String!){
    user(login: $username) {
      current: contributionsCollection {
        totalIssueContributions
        totalCommitContributions
        totalRepositoryContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoriesWithContributedIssues
        totalRepositoriesWithContributedCommits
        totalRepositoriesWithContributedPullRequests
      }
      ${fragments}
    }
  }
`;

// Fragments
const calendar_fragment = (c: number, fromYear: string, toYear: string) => `
  calendarT${c}: contributionsCollection(from:"${fromYear}", to:"${toYear}" ){
    totalIssueContributions
    totalCommitContributions
    totalRepositoryContributions
    totalPullRequestContributions
    totalPullRequestReviewContributions
    totalRepositoriesWithContributedIssues
    totalRepositoriesWithContributedCommits
    totalRepositoriesWithContributedPullRequests
    contributionCalendar{
      totalContributions
      weeks{
        contributionDays{
          contributionCount
          date
        }
      }
    }
    commitContributionsByRepository {
      ${contributionByRepositoryFragment}
    }
    issueContributionsByRepository {
      ${contributionByRepositoryFragment}
    }
    pullRequestContributionsByRepository {
      ${contributionByRepositoryFragment}
    }
  }
`;

const contributionByRepositoryFragment = `
  repository {
    openGraphImageUrl
    name
    nameWithOwner
    url
    owner{
      avatarUrl
      login
      url
    }
    assignableUsers(first:100){
      totalCount
      nodes{
        login
        name
        url
        avatarUrl
      }
    }
    languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
      totalCount
      totalSize
      edges {
        size
        node {
          name
          color
        }
      }
    }
  }
`;
//#endregion

//#region > Exports
export { profile, calendar, calendar_fragment };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
