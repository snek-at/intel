//#region > Statements
const initialize = `
DROP TABLE IF EXISTS streak;

CREATE TABLE IF NOT EXISTS streak
  (
     id          INT NOT NULL auto_increment,
     startDate   DATE NULL,
     endDate     DATE NULL,
     total       INT NULL,
     statisticId INT NOT NULL REFERENCES statistic(id),
     PRIMARY KEY (id)
  );
`;

const create = `
INSERT INTO streak
            (startDate,
             endDate,
             total,
             statisticId)
VALUES      (?,
             ?,
             ?,
             ?);
`;

const get = `
SELECT *
FROM   streak
WHERE  id = ?
`;

const all = `
SELECT *
FROM   streak
`;
//#endregion

//#region > Exports
export { initialize, create, get, all };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
