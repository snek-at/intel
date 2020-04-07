const initialize = `
  DROP TABLE IF EXISTS repository;
  CREATE TABLE IF NOT EXISTS repository (
    id INT NOT NULL AUTO_INCREMENT,
    avatarUrl VARCHAR(2048) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    name VARCHAR(80) NOT NULL,
    owner_id INT NULL REFERENCES member (id),
    UNIQUE(url),
    PRIMARY KEY (id)
  );
`;

const create = `
  INSERT INTO repository(
    avatarUrl,
    url,
    name,
    owner_id
  )
  VALUES (?,?,?,?);
`;

const get = `
  SELECT
    *
  FROM
    repository
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    repository r
`;

const withOwner = `
  SELECT
    r.id as id,
    r.avatarUrl as avatarUrl,
    r.url as url,
    r.name as name,
    m.username as owner
  FROM 
    repository r
  INNER JOIN
    member m
      ON r.owner_id = m.id
`;

export { initialize, create, get, all, withOwner };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
