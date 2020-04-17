//#region > Statements
const initialize = `
  DROP TABLE IF EXISTS language;
  CREATE TABLE IF NOT EXISTS language (
    id INT NOT NULL AUTO_INCREMENT,
    color VARCHAR(80) NULL,
    name VARCHAR(80) NOT NULL,
    size INT NOT NULL,
    repositoryId INT NULL REFERENCES repository (id),
    PRIMARY KEY (id)
  );
`;

const create = `
  INSERT INTO language(
    color,
    name,
    size,
    repositoryId
  )
  VALUES (?,?,?,?);
`;

const get = `
  SELECT
    *
  FROM
    language
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    language
`;

const byRepository = (repositoryId: number) => `
  SELECT
    L1.color,
    L1.name,
    sum(L1.size) as size,
    ROUND(sum(L1.size) / (SELECT sum(size) FROM language L2 WHERE repositoryId = ${repositoryId}) * 100, 2) as share
  FROM
    language L1
  WHERE
    repositoryId = ${repositoryId}
  GROUP BY 
    name, color
  ORDER BY
    size DESC
`;

const merged = `
  SELECT
    L1.color,
    L1.name,
    sum(L1.size) as size,
    ROUND(sum(L1.size) / (SELECT sum(size) FROM language L2) * 100, 2) as share
  FROM
    language L1
  GROUP BY
    name, color
  ORDER BY
    size DESC
`;
//#endregion

//#region > Exports
export { initialize, create, get, all, byRepository, merged };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
