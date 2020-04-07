const initialize = `
  DROP TABLE IF EXISTS platform_has_repository ;
  CREATE TABLE IF NOT EXISTS platform_has_repository (
    platform_id INT NOT NULL REFERENCES platform (id),
    repository_id INT NOT NULL  REFERENCES repository (id),
    PRIMARY KEY (platform_id, repository_id)
  );
`;

const create = `
  INSERT INTO platform_has_repository(
    platform_id,
    repository_id
  )
  VALUES (?,?);
`;

const all = `
  SELECT
    *
  FROM
    platform_has_repository
  INNER JOIN
    repository r
      ON repository_id = r.id
`;

export {initialize, create, all};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
