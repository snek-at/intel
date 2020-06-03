//#region > Statements
const initialize = `
DROP TABLE IF EXISTS statistic;

CREATE TABLE IF NOT EXISTS statistic
  (
     id                                           INT NOT NULL auto_increment,
     year                                         INT NOT NULL,
     totalIssueContributions                      INT NOT NULL,
     totalCommitContributions                     INT NOT NULL,
     totalRepositoryContributions                 INT NOT NULL,
     totalPullRequestContributions                INT NOT NULL,
     totalPullRequestReviewContributions          INT NOT NULL,
     totalRepositoriesWithContributedIssues       INT NOT NULL,
     totalRepositoriesWithContributedCommits      INT NOT NULL,
     totalRepositoriesWithContributedPullRequests INT NOT NULL,
     platformId                                   INT NOT NULL REFERENCES
     platform (id),
     UNIQUE(year, platformId),
     PRIMARY KEY (id)
  );
`;

const create = `
INSERT INTO statistic
            (year,
             totalIssueContributions,
             totalCommitContributions,
             totalRepositoryContributions,
             totalPullRequestContributions,
             totalPullRequestReviewContributions,
             totalRepositoriesWithContributedIssues,
             totalRepositoriesWithContributedCommits,
             totalRepositoriesWithContributedPullRequests,
             platformId)
VALUES      (?,
             ?,
             ?,
             ?,
             ?,
             ?,
             ?,
             ?,
             ?,
             ?);
`;

const get = `
SELECT *
FROM   statistic
WHERE  id = ?
`;

const all = `
SELECT *
FROM   statistic
`;

const allMerged = `
SELECT year,
       Sum(totalIssueContributions)                      AS
       totalIssueContributions,
       Sum(totalCommitContributions)                     AS
       totalCommitContributions,
       Sum(totalRepositoryContributions)                 AS
       totalRepositoryContributions,
       Sum(totalPullRequestContributions)                AS
       totalPullRequestContributions,
       Sum(totalPullRequestReviewContributions)          AS
       totalPullRequestReviewContributions,
       Sum(totalRepositoriesWithContributedIssues)       AS
       totalRepositoriesWithContributedIssues,
       Sum(totalRepositoriesWithContributedCommits)      AS
       totalRepositoriesWithContributedCommits,
       Sum(totalRepositoriesWithContributedPullRequests) AS
       totalRepositoriesWithContributedPullRequests
FROM   statistic
GROUP  BY year
ORDER  BY year
`;

const contributionSumFragment = `
  Sum(totalCommitContributions)
  + Sum(totalIssueContributions)
  + Sum(totalPullRequestContributions)
  + Sum(totalPullRequestReviewContributions)
`;

const contributionOfYearFragment = (type: string) => `
SELECT   Sum(${type})                                                AS total,
         round(Sum(${type}) / (${contributionSumFragment}) * 100, 2) AS share
FROM     statistic
WHERE    year = ?
GROUP BY year
`;

const commitContributionsOfYear = `
  ${contributionOfYearFragment("totalCommitContributions")}
`;

const issueContributionsOfYear = `
  ${contributionOfYearFragment("totalIssueContributions")}
`;

const pullRequestContributionsOfYear = `
  ${contributionOfYearFragment("totalPullRequestContributions")}
`;

const pullRequestReviewContributionsOfYear = `
  ${contributionOfYearFragment("totalPullRequestReviewContributions")}
`;
//#endregion

//#region > Exports
export {
  initialize,
  create,
  get,
  all,
  allMerged,
  commitContributionsOfYear,
  issueContributionsOfYear,
  pullRequestContributionsOfYear,
  pullRequestReviewContributionsOfYear,
};
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
