//#region > Statements
const initialize = `
DROP TABLE IF EXISTS repositoryhasmember;

CREATE TABLE IF NOT EXISTS repositoryhasmember
  (
     id           INT NOT NULL auto_increment,
     repositoryId INT NOT NULL REFERENCES repository (id),
     memberId     INT NOT NULL REFERENCES member (id),
     UNIQUE(id),
     PRIMARY KEY (repositoryId, memberId)
  );
`;

const create = `
INSERT INTO repositoryhasmember
            (repositoryId,
             memberId)
VALUES      (?,
             ?);
`;

const all = `
SELECT *
FROM   repositoryhasmember
       INNER JOIN member m
               ON memberId = m.id
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
