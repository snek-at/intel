const initialize = `
  DROP TABLE IF EXISTS statistic;
  CREATE TABLE IF NOT EXISTS statistic (
    id INT NOT NULL AUTO_INCREMENT,
    year INT NOT NULL,
    totalIssueContributions INT NOT NULL,
    totalCommitContributions INT NOT NULL,
    totalRepositoryContributions INT NOT NULL,
    totalPullRequestContributions INT NOT NULL,
    totalPullRequestReviewContributions INT NOT NULL,
    totalRepositoriesWithContributedIssues INT NOT NULL,
    totalRepositoriesWithContributedCommits INT NOT NULL,
    totalRepositoriesWithContributedPullRequests INT NOT NULL,
    platform_id INT NOT NULL REFERENCES platform (id),
    UNIQUE(year, platform_id),
    PRIMARY KEY (id)
  );
`;

const create = `
  INSERT INTO statistic(
    year,
    totalIssueContributions,
    totalCommitContributions,
    totalRepositoryContributions,
    totalPullRequestContributions,
    totalPullRequestReviewContributions,
    totalRepositoriesWithContributedIssues,
    totalRepositoriesWithContributedCommits,
    totalRepositoriesWithContributedPullRequests,
    platform_id
  )
  VALUES (?,?,?,?,?,?,?,?,?,?);
`;

const get = `
  SELECT
    *
  FROM
    statistic
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    statistic
`;

const allMerged = `
  SELECT
    year,
    sum(totalIssueContributions) as totalIssueContributions,
    sum(totalCommitContributions) as totalCommitContributions,
    sum(totalRepositoryContributions) as totalRepositoryContributions,
    sum(totalPullRequestContributions) as totalPullRequestContributions,
    sum(totalPullRequestReviewContributions) as totalPullRequestReviewContributions,
    sum(totalRepositoriesWithContributedIssues) as totalRepositoriesWithContributedIssues,
    sum(totalRepositoriesWithContributedCommits) as totalRepositoriesWithContributedCommits,
    sum(totalRepositoriesWithContributedPullRequests) as totalRepositoriesWithContributedPullRequests
  FROM
    statistic
  GROUP BY year
`;

const a = `
  SELECT
    sum(totalIssueContributions) as totalIssueContributions,
    sum(totalCommitContributions) as totalCommitContributions,
    sum(totalPullRequestContributions) as totalPullRequestContributions,
    sum(totalPullRequestReviewContributions) as totalPullRequestReviewContributions,
    ROUND(sum(S1.size) / (SELECT sum(size) FROM statistic S2 ) * 100, 2) as share
  FROM
    statistic S1
  GROUP BY year;
`;

const contributionSumFragment =
  "sum(totalCommitContributions) + sum(totalIssueContributions) + sum(totalPullRequestContributions) + sum(totalPullRequestReviewContributions)";

const contributionOfYearFragment = (type) => `
  SELECT
  sum(${type}) as total,
  ROUND(sum(${type}) / (${contributionSumFragment}) * 100, 2) as share
  FROM
  statistic
  WHERE year = ?
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

export {
  initialize,
  create,
  get,
  all,
  allMerged,
  commitContributionsOfYear,
  issueContributionsOfYear,
  pullRequestContributionsOfYear,
  pullRequestReviewContributionsOfYear
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
