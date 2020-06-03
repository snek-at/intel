//#region > Statements
const initialize = `
DROP TABLE IF EXISTS talk;

CREATE TABLE IF NOT EXISTS talk
  (
     id             INT NOT NULL auto_increment,
     name           VARCHAR(80) NOT NULL,
     url            VARCHAR(2024) NOT NULL,
     displayUrl     VARCHAR(2024) NOT NULL,
     downloadUrl    VARCHAR(2024) NOT NULL,
     path           VARCHAR(2024) NOT NULL,
     repositoryData TEXT NOT NULL,
     PRIMARY KEY (id)
  );
`;

const create = `
INSERT INTO talk
            (name,
             url,
             displayUrl,
             downloadUrl,
             path,
             repositoryData)
VALUES      (?,
             ?,
             ?,
             ?,
             ?,
             ?);
`;

const get = `
SELECT *
FROM   talk
WHERE  id = ?
`;

const all = `
SELECT *
FROM   talk
`;
//#endregion

//#region > Exports
export { initialize, create, get, all };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
