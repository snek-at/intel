//#region > Statements
const initialize = `
DROP TABLE IF EXISTS platform;

CREATE TABLE IF NOT EXISTS platform
  (
     id              INT NOT NULL auto_increment,
     platformName    VARCHAR(80) NOT NULL,
     platformUrl     VARCHAR(2048) NOT NULL,
     avatarUrl       VARCHAR(2048) NOT NULL,
     websiteUrl      VARCHAR(2048) NOT NULL,
     company         VARCHAR(80) NOT NULL,
     email           VARCHAR(80) NOT NULL,
     username        VARCHAR(80) NOT NULL,
     fullname        VARCHAR(80) NOT NULL,
     createdAt       DATE NOT NULL,
     location        VARCHAR(80) NULL,
     statusMessage   VARCHAR(80) NULL,
     statusEmojiHTML VARCHAR(80) NULL,
     PRIMARY KEY (id)
  );
`;

const create = `
INSERT INTO platform
            (platformName,
             platformUrl,
             avatarUrl,
             websiteUrl,
             company,
             email,
             username,
             fullname,
             createdAt,
             location,
             statusMessage,
             statusEmojiHTML)
VALUES      (?,
             ?,
             ?,
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
FROM   platform
WHERE  id = ?
`;

const all = `
SELECT *
FROM   platform
`;

const lowestCreatedAtYear = `
SELECT Year(Min(createdAt)) AS createdAt
FROM   platform
`;

const getSourceTypes = `
SELECT platformName        AS source,
       Count(platformName) AS total
FROM   platform
GROUP  BY platformName
`;
//#endregion

//#region > Exports
export { initialize, create, get, all, lowestCreatedAtYear, getSourceTypes };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
