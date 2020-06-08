//#region > Statements
const initialize = `
DROP TABLE IF EXISTS organizationhasmember;

CREATE TABLE IF NOT EXISTS organizationhasmember
  (
     id             INT NOT NULL auto_increment,
     organizationId INT NOT NULL REFERENCES organization (id),
     memberId       INT NOT NULL REFERENCES member (id),
     UNIQUE(id),
     PRIMARY KEY (organizationId, memberId)
  );
`;

const create = `
INSERT INTO organizationhasmember
            (organizationId,
             memberId)
VALUES      (?,
             ?);
`;

const all = `
SELECT *
FROM   organizationhasmember
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
