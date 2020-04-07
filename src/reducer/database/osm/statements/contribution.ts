const initialize = `
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

const create = `
  INSERT INTO contribution(
    repoUrl,
    datetime,
    nameWithOwner,
    type,
    calendar_id
  )
  VALUES (?,?,?,?,?);
`;

const get = `
  SELECT
    *
  FROM
    contribution
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    contribution
`;

export { initialize, create, get, all };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
