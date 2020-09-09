//#region > Imports
//> GQL
// DocumentNode needed for queries
import gql from "graphql-tag";
//#endregion

//#region > Queries
const getProfiles = gql`
  query getProfiles($token: String!, $personName: String!) {
    personProfiles(token: $token, personName: $personName) {
      id
      createdAt
      updatedAt
      username
      accessToken
      sourceUrl
      sourceType
      isActive
    }
  }
`;

const getPerson = gql`
  query profile($slug: String!, $token: String!) {
    page(slug: $slug, token: $token) {
      ... on PersonPage {
        title
        firstName
        lastName
        status
        bio
        email
        displayEmail
        workplace
        displayWorkplace
        websiteUrl
        location
        displayRanking
        displayProgrammingLanguages
        display2dCalendar
        display3dCalendar
        bids
        tids
        avatarImage {
          src
        }
        profiles {
          sourceType
          isActive
        }
        metaLinks {
          id
          url
          linkType
          location
          description
          imgurDeleteHash
        }
        movablePool {
          ... on Movable {
            rawValue
            field
          }
        }
        person {
          currentStatistic {
            ... on _Person_Statistic {
              calendar3d {
                src
              }
              calendar2d
              contributionType2d
              totalIssueContributions
              totalCommitContributions
              totalRepositoryContributions
              totalPullRequestContributions
              totalPullRequestReviewContributions
              totalRepositoriesWithContributedIssues
              totalRepositoriesWithContributedCommits
              totalRepositoriesWithContributedPullRequests
              currentStreak {
                ... on _Person_Statistic_Streak {
                  startDate
                  endDate
                  totalContributions
                  totalDays
                }
              }
              longestStreak {
                ... on _Person_Statistic_Streak {
                  startDate
                  endDate
                  totalContributions
                  totalDays
                }
              }
            }
          }
          yearsStatistic {
            ... on _Person_Statistic {
              calendar3d {
                src
              }
              calendar2d
              contributionType2d
              totalIssueContributions
              totalCommitContributions
              totalRepositoryContributions
              totalPullRequestContributions
              totalPullRequestReviewContributions
              totalRepositoriesWithContributedIssues
              totalRepositoriesWithContributedCommits
              totalRepositoriesWithContributedPullRequests
              currentStreak {
                ... on _Person_Statistic_Streak {
                  startDate
                  endDate
                  totalContributions
                  totalDays
                }
              }
              longestStreak {
                ... on _Person_Statistic_Streak {
                  startDate
                  endDate
                  totalContributions
                  totalDays
                }
              }
            }
          }
          projects {
            ... on _Person_Project {
              avatarUrl
              url
              name
              fullname
              owner {
                ... on _Person_Member {
                  avatarUrl
                  url
                  fullname
                  name
                }
              }
              members {
                ... on _Person_Member {
                  avatarUrl
                  url
                  fullname
                  name
                }
              }
              languages {
                ... on _Person_Language {
                  color
                  name
                  size
                  share
                }
              }
            }
          }
          organisations {
            ... on _Person_Organisation {
              avatarUrl
              url
              name
              fullname
              description
              members {
                ... on _Person_Member {
                  avatarUrl
                  url
                  fullname
                  name
                }
              }
              projects {
                ... on _Person_Project {
                  avatarUrl
                  url
                  name
                  fullname
                  owner {
                    ... on _Person_Member {
                      avatarUrl
                      url
                      fullname
                      name
                    }
                  }
                  members {
                    ... on _Person_Member {
                      avatarUrl
                      url
                      fullname
                      name
                    }
                  }
                  languages {
                    ... on _Person_Language {
                      color
                      name
                      size
                      share
                    }
                  }
                }
              }
            }
          }
          languages {
            ... on _Person_Language {
              color
              name
              size
              share
            }
          }
        }
        follows {
          slug
          title
          firstName
          lastName
          status
          bio
          avatarImage {
            src
          }
        }
        followedBy {
          slug
          title
          firstName
          lastName
          status
          bio
          avatarImage {
            src
          }
        }
        likes {
          slug
          title
          firstName
          lastName
          status
          bio
          avatarImage {
            src
          }
        }
        likedBy {
          slug
          title
          firstName
          lastName
          status
          bio
          avatarImage {
            src
          }
        }
        achievements {
          id
          title
          description
          image {
            src
          }
          points
        }
        talks {
          id
          title
          description
          path
          url
          talkComments {
            id
            createdAt
            updatedAt
            text
            author {
              slug
              title
              firstName
              lastName
              status
              bio
              avatarImage {
                src
              }
            }
            replies {
              id
            }
            talk {
              id
            }
          }
          owner {
            avatarImage {
              src
            }
            title
            slug
          }
          displayUrl
          downloadUrl
        }
      }
    }
  }
`;

const allUserPagesBrief = gql`
  query userPages($token: String!) {
    page(token: $token, slug: "people") {
      children {
        ... on PersonPage {
          slug
          title
          firstName
          lastName
          status
          bio
          avatarImage {
            src
          }
        }
      }
    }
  }
`;
//#endregion

//#region > Exports
export { getProfiles, getPerson, allUserPagesBrief };
//#endregion
