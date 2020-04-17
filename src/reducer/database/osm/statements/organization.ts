//#region > Statements
const initialize = `
  DROP TABLE IF EXISTS organization;
  CREATE TABLE IF NOT EXISTS organization (
    id INT NOT NULL AUTO_INCREMENT,
    avatarUrl VARCHAR(2048) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    name VARCHAR(80) NOT NULL,
    fullname VARCHAR(80) NOT NULL,
    description VARCHAR(255),
    UNIQUE(url),
    PRIMARY KEY (id)
  );
`;

const create = `
  INSERT INTO organization(
    avatarUrl,
    url,
    name,
    fullname,
    description
  )
  VALUES (?,?,?,?,?);
`;

const get = `
  SELECT
    *
  FROM
    organization
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    organization o
`;
//#endregion

//#region > Exports
export { initialize, create, get, all };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
