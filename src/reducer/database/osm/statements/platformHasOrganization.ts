//#region > Statements
const initialize = `
  DROP TABLE IF EXISTS platformhasorganization;
  CREATE TABLE IF NOT EXISTS platformhasorganization (
    id INT NOT NULL AUTO_INCREMENT,
    platformId INT NOT NULL REFERENCES platform (id),
    organizationId INT NOT NULL REFERENCES organization (id),
    UNIQUE(id),
    PRIMARY KEY (platformId, organizationId)
  );
`;

const create = `
  INSERT INTO platformhasorganization(
    platformId,
    organizationId
  )
  VALUES (?,?);
`;

const all = `
  SELECT
    *
  FROM
    platformhasorganization
  INNER JOIN
    organization o
      ON organizationId = o.id
`;
//#endregion

//#region > Exports
export { initialize, create, all };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
