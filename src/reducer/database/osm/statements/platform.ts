const initialize = `
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

const create = `
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

const get = `
  SELECT
    *
  FROM
    platform
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    platform

`;

const lowestCreatedAtYear = `
  SELECT 
    year(min(createdAt)) as createdAt
  FROM
    platform  
`;

export { initialize, create, get, all, lowestCreatedAtYear };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
