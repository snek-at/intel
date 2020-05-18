//#region > Statements
const initialize = `
DROP TABLE IF EXISTS repository;

CREATE TABLE IF NOT EXISTS repository
  (
     id        INT NOT NULL auto_increment,
     avatarUrl VARCHAR(2048) NOT NULL,
     url       VARCHAR(2048) NOT NULL,
     name      VARCHAR(80) NOT NULL,
     ownerid   INT NULL REFERENCES member (id),
     UNIQUE(url),
     PRIMARY KEY (id)
  );
`;

const create = `
INSERT INTO repository
            (avatarUrl,
             url,
             name,
             ownerid)
VALUES      (?,
             ?,
             ?,
             ?);
`;

const get = `
SELECT *
FROM   repository
WHERE  id = ?
`;

const all = `
SELECT *
FROM   repository r
`;

const withOwner = `
SELECT r.id        AS id,
       r.avatarUrl AS avatarUrl,
       r.url       AS url,
       r.name      AS name,
       m.username  AS owner
FROM   repository r
       INNER JOIN member m
               ON r.ownerid = m.id
`;
//#endregion

//#region > Exports
export { initialize, create, get, all, withOwner };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
