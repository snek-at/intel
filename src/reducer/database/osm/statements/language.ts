//#region > Statements
const initialize = `
DROP TABLE IF EXISTS language;

CREATE TABLE IF NOT EXISTS language
  (
     id           INT NOT NULL auto_increment,
     color        VARCHAR(80) NULL,
     name         VARCHAR(80) NOT NULL,
     size         INT NOT NULL,
     repositoryId INT NULL REFERENCES repository (id),
     PRIMARY KEY (id)
  );
`;

const create = `
INSERT INTO language
            (color,
             name,
             size,
             repositoryId)
VALUES      (?,
             ?,
             ?,
             ?);
`;

const get = `
SELECT *
FROM   language
WHERE  id = ?
`;

const all = `
SELECT *
FROM   language
`;

const byRepository = (repositoryId: number) => `
SELECT   l1.color,
         l1.name,
         Sum(l1.size) AS size,
         round(Sum(l1.size) /
         (
                SELECT Sum(size)
                FROM   language L2
                WHERE  repositoryId = ${repositoryId}) * 100, 2) AS share
FROM     language l1
WHERE    repositoryId = ${repositoryId}
GROUP BY name,
         color
ORDER BY size DESC
`;

const merged = `
SELECT L1.color,
       L1.name,
       Sum(L1.size)                                        AS size,
       Round(Sum(L1.size) / (SELECT Sum(size)
                             FROM   language L2) * 100, 2) AS share
FROM   language L1
GROUP  BY name,
          color
ORDER  BY size DESC
`;
//#endregion

//#region > Exports
//> Constants
export { initialize, create, get, all, byRepository, merged };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
