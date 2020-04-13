
//#region > Statements
const initialize = `
  DROP TABLE IF EXISTS member;
  CREATE TABLE IF NOT EXISTS member (
    id INT NOT NULL AUTO_INCREMENT,
    avatarUrl VARCHAR(2048) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    fullname VARCHAR(80) NULL,
    username VARCHAR(80) NOT NULL,
    platformId INT NOT NULL REFERENCES platform (id),
    UNIQUE(username, platformId),
    PRIMARY KEY (id)
  );
`;

const create = `
  INSERT INTO member(
    avatarUrl,
    url,
    fullname,
    username,
    platformId
  )
  VALUES (?,?,?,?,?);
`;

const get = `
  SELECT
    *
  FROM
    member
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    member
`;
//#endregion

//#region > Exports
export { initialize, create, get, all };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
