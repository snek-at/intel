import { gql } from "apollo-boost";

//> Queries
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

const calendar = (fragments) =>
  gql(String.raw`
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
`);

//> Fragments
const calendarFragment = (c, fromYear, toYear) => `
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

export { profile, calendar, calendarFragment };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
