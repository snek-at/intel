const initialize = `
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

const create = `
  INSERT INTO member(
    avatarUrl,
    url,
    fullname,
    username,
    platform_id
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



export { initialize, create, get, all };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
