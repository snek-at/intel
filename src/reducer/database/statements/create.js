const platform = `
  DROP TABLE IF EXISTS platform;
  CREATE TABLE IF NOT EXISTS platform (
    id INT NOT NULL AUTO_INCREMENT,
    platformName VARCHAR(80) NOT NULL,
    platformUrl VARCHAR(2048) NOT NULL,
    avatarUrl VARCHAR(2048) NOT NULL,
    websiteUrl VARCHAR(2048) NOT NULL,
    company VARCHAR(80) NOT NULL,
    email VARCHAR(80) NOT NULL,
    username VARCHAR(80) NOT NULL,
    fullName VARCHAR(80) NOT NULL,
    createdAt DATE NOT NULL,
    location VARCHAR(80) NULL,
    statusMessage VARCHAR(80) NULL,
    statusEmojiHTML VARCHAR(80) NULL,
    PRIMARY KEY (id)
  );
`;

const repository = `
  DROP TABLE IF EXISTS repository;
  CREATE TABLE IF NOT EXISTS repository (
    id INT NOT NULL AUTO_INCREMENT,
    avatarUrl VARCHAR(2048) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    name VARCHAR(80) NOT NULL,
    owner_id INT NULL REFERENCES member (id),
    PRIMARY KEY (id)
  );
`;

const organization = `
  DROP TABLE IF EXISTS organization;
  CREATE TABLE IF NOT EXISTS organization (
    id INT NOT NULL AUTO_INCREMENT,
    avatarUrl VARCHAR(2048) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    name VARCHAR(80) NOT NULL,
    PRIMARY KEY (id)
  );
`;

const member = `
  DROP TABLE IF EXISTS member;
  CREATE TABLE IF NOT EXISTS member (
    id INT NOT NULL AUTO_INCREMENT,
    avatarUrl VARCHAR(2048) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    fullname VARCHAR(80) NULL,
    username VARCHAR(80) NOT NULL,
    platform_id INT NOT NULL REFERENCES platform (id),
    UNIQUE(username, platform_id),
    PRIMARY KEY (id)
  );
`;

const language = `
  DROP TABLE IF EXISTS language;
  CREATE TABLE IF NOT EXISTS language (
    id INT NOT NULL AUTO_INCREMENT,
    color VARCHAR(80) NULL,
    name VARCHAR(80) NOT NULL,
    size INT NOT NULL,
    repository_id INT NULL REFERENCES repository (id),
    PRIMARY KEY (id)
  );
`;

const statistic = `
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

const streak = `
  DROP TABLE IF EXISTS streak ;
  CREATE TABLE IF NOT EXISTS streak (
    id INT NOT NULL AUTO_INCREMENT,
    startDate DATE NULL,
    endDate DATE NULL,
    total INT NULL,
    statistic_id INT NOT NULL REFERENCES statistic(id),
    PRIMARY KEY (id)
  );
`;

const calendar = `
  DROP TABLE IF EXISTS calendar;
  CREATE TABLE IF NOT EXISTS calendar (
    id INT NOT NULL AUTO_INCREMENT,
    date DATE NOT NULL,
    week INT NOT NULL,
    weekday INT NOT NULL,
    total INT NOT NULL,
    color VARCHAR(7) NULL,
    platform_id INT NOT NULL  REFERENCES platform (id),
    PRIMARY KEY (id)
  );
`;

const contribution = `
  DROP TABLE IF EXISTS contribution;
  CREATE TABLE IF NOT EXISTS contribution (
    id INT NOT NULL AUTO_INCREMENT,
    repoUrl VARCHAR(2048) NOT NULL,
    datetime DATETIME NOT NULL,
    nameWithOwner VARCHAR(80) NOT NULL,
    type VARCHAR(80) NOT NULL,
    calendar_id INT NOT NULL REFERENCES calendar (id),
    PRIMARY KEY (id)
  );
`;

const organizationHasMember = `
  DROP TABLE IF EXISTS organization_has_member;
  CREATE TABLE IF NOT EXISTS organization_has_member (
    organization_id INT NOT NULL REFERENCES organization (id),
    member_id INT NOT NULL REFERENCES member (id),
    PRIMARY KEY (organization_id, member_id)
  );
`;

const repositoryHasMember = `
  DROP TABLE IF EXISTS repository_has_member ;
  CREATE TABLE IF NOT EXISTS repository_has_member (
    repository_id INT NOT NULL REFERENCES repository (id),
    member_id INT NOT NULL  REFERENCES member (id),
    PRIMARY KEY (repository_id, member_id)
  );
`;

const platformHasOrganization = `
  DROP TABLE IF EXISTS platform_has_organization;
  CREATE TABLE IF NOT EXISTS platform_has_organization (
    platform_id INT NOT NULL REFERENCES platform (id),
    organization_id INT NOT NULL REFERENCES organization (id),
    PRIMARY KEY (platform_id, organization_id)
  );
`;

const platformHasRepository = `
  DROP TABLE IF EXISTS platform_has_repository ;
  CREATE TABLE IF NOT EXISTS platform_has_repository (
    platform_id INT NOT NULL REFERENCES platform (id),
    repository_id INT NOT NULL  REFERENCES repository (id),
    PRIMARY KEY (platform_id, repository_id)
  );
`;

export {
  platform,
  repository,
  organization,
  member,
  language,
  statistic,
  streak,
  calendar,
  contribution,
  organizationHasMember,
  repositoryHasMember,
  platformHasOrganization,
  platformHasRepository,
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
