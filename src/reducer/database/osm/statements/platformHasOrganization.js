const initialize = `
    DROP TABLE IF EXISTS platform_has_organization;
    CREATE TABLE IF NOT EXISTS platform_has_organization (
    platform_id INT NOT NULL REFERENCES platform (id),
    organization_id INT NOT NULL REFERENCES organization (id),
    PRIMARY KEY (platform_id, organization_id)
    );
`;

const create = `
  INSERT INTO platform_has_organization(
    platform_id,
    organization_id
  )
  VALUES (?,?);
`;

const all = `
  SELECT
    *
  FROM
    platform_has_organization
  INNER JOIN
    organization o
      ON organization_id = o.id
`;

export {initialize, create, all}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
