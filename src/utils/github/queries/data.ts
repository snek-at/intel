import { gql } from "apollo-boost";

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

const calendar = (fragments:string) =>
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

// Fragments

const calendar_fragment = (c:number, fromYear:string, toYear:string) => `
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
      ${contribution_by_repository_fragment}
    }
    issueContributionsByRepository {
      ${contribution_by_repository_fragment}
    }
    pullRequestContributionsByRepository {
      ${contribution_by_repository_fragment}
    }
  }
`;

const contribution_by_repository_fragment = `
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

export { profile, calendar, calendar_fragment };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
