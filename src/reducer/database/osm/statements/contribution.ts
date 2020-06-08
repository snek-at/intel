//#region > Statements
const initialize = `
DROP TABLE IF EXISTS contribution;

CREATE TABLE IF NOT EXISTS contribution
  (
     id            INT NOT NULL auto_increment,
     repoUrl       VARCHAR(2048) NOT NULL,
     datetime      DATETIME NOT NULL,
     nameWithOwner VARCHAR(80) NOT NULL,
     type          VARCHAR(80) NOT NULL,
     calendarId    INT NOT NULL REFERENCES calendar (id),
     PRIMARY KEY (id)
  );
`;

const create = `
INSERT INTO contribution
            (repoUrl,
             datetime,
             nameWithOwner,
             type,
             calendarId)
VALUES      (?,
             ?,
             ?,
             ?,
             ?);
`;

const get = `
SELECT *
FROM   contribution
WHERE  id = ?
`;

const all = `
SELECT *
FROM   contribution
`;
//#endregion

//#region > Exports
//> Constant Variables
export { initialize, create, get, all };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
