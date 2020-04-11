const initialize = `
  DROP TABLE IF EXISTS repository_has_member ;
  CREATE TABLE IF NOT EXISTS repository_has_member (
    repository_id INT NOT NULL REFERENCES repository (id),
    member_id INT NOT NULL  REFERENCES member (id),
    PRIMARY KEY (repository_id, member_id)
  );
`;

const create = `
  INSERT INTO repository_has_member(
    repository_id,
    member_id
  )
  VALUES (?,?);
`;

const all = `
  SELECT
    *
  FROM
    repository_has_member
  INNER JOIN
    member m
      ON member_id = m.id
`;

export { initialize, create, all };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
