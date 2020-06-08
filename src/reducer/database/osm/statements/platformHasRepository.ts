//#region > Statementss
const initialize = `
DROP TABLE IF EXISTS platformhasrepository;

CREATE TABLE IF NOT EXISTS platformhasrepository
  (
     id           INT NOT NULL auto_increment,
     platformId   INT NOT NULL REFERENCES platform (id),
     repositoryId INT NOT NULL REFERENCES repository (id),
     UNIQUE(id),
     PRIMARY KEY (platformId, repositoryId)
  );
`;

const create = `
INSERT INTO platformhasrepository
            (platformId,
             repositoryId)
VALUES      (?,
             ?);
`;

const all = `
SELECT *
FROM   platformhasrepository
       INNER JOIN repository r
               ON repositoryId = r.id
`;
//#endregion

//#region > Exports
//> Constant Variables
export { initialize, create, all };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
