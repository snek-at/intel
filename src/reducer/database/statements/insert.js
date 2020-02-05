const platform = `
  INSERT INTO platform(
    platformName,
    platformUrl,
    avatarUrl,
    websiteUrl,
    company,
    email,
    username,
    fullName,
    createdAt,
    location,
    statusMessage,
    statusEmojiHTML
  )
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?);
`;

const organization = `
  INSERT INTO organization(
    avatarUrl,
    url,
    name
  )
  VALUES (?,?,?);
`;

const member = `
  INSERT INTO member(
    avatarUrl,
    url,
    fullname,
    username,
    platform_id
  )
  VALUES (?,?,?,?,?);
`;

const organizationHasMember = `
  INSERT INTO organization_has_member(
    organization_id,
    member_id
  )
  VALUES (?,?);
`;

const repositoryHasMember = `
  INSERT INTO repository_has_member(
    repository_id,
    member_id
  )
  VALUES (?,?);
`;

const platformHasOrganization = `
  INSERT INTO platform_has_organization(
    platform_id,
    organization_id
  )
  VALUES (?,?);
`;

const calendar = `
  INSERT INTO calendar(
    date,
    week,
    weekday,
    total,
    color,
    platform_id
  )
  VALUES (?,?,?,?,?,?)
`;

const language = `
  INSERT INTO language(
    color,
    name,
    size,
    repository_id
  )
  VALUES (?,?,?,?)
`;

const repository = `
  INSERT INTO repository(
    avatarUrl,
    url,
    name,
    owner_id
  )
  VALUES (?,?,?,?);
`;

const platformHasRepository = `
  INSERT INTO platform_has_repository(
    platform_id,
    repository_id
  )
  VALUES (?,?);
`;

const statistic = `
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
  VALUES(?,?,?,?,?,?,?,?,?,?);
`;
const streak = `
  INSERT INTO streak(
    startDate,
    endDate,
    total,
    statistic_id
  )
  VALUES(?,?,?,?);
`;

export {
  platform,
  organization,
  member,
  organizationHasMember,
  repositoryHasMember,
  platformHasOrganization,
  calendar,
  language,
  repository,
  platformHasRepository,
  statistic,
  streak
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
