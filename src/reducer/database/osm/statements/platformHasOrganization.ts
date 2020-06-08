//#region > Statements
const initialize = `
DROP TABLE IF EXISTS platformhasorganization;

CREATE TABLE IF NOT EXISTS platformhasorganization
  (
     id             INT NOT NULL auto_increment,
     platformId     INT NOT NULL REFERENCES platform (id),
     organizationId INT NOT NULL REFERENCES organization (id),
     UNIQUE(id),
     PRIMARY KEY (platformId, organizationId)
  );
`;

const create = `
INSERT INTO platformhasorganization
            (platformId,
             organizationId)
VALUES      (?,
             ?);
`;

const all = `
SELECT *
FROM   platformhasorganization
       INNER JOIN organization o
               ON organizationId = o.id
`;
//#endregion

//#region > Exports
//> Constants
export { initialize, create, all };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
