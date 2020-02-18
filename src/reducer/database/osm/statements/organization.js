const initialize = `
    DROP TABLE IF EXISTS organization;
    CREATE TABLE IF NOT EXISTS organization (
    id INT NOT NULL AUTO_INCREMENT,
    avatarUrl VARCHAR(2048) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    name VARCHAR(80) NOT NULL,
    fullname VARCHAR(80) NOT NULL,
    UNIQUE(url),
    PRIMARY KEY (id)
    );
`;

const create = `
  INSERT INTO organization(
    avatarUrl,
    url,
    name,
    fullname
  )
  VALUES (?,?,?,?);
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

export { initialize, create, get, all };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
