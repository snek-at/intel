//#region > Statements
const initialize = `
  DROP TABLE IF EXISTS calendar;
  CREATE TABLE IF NOT EXISTS calendar (
    id INT NOT NULL AUTO_INCREMENT,
    date DATE NOT NULL,
    total INT NOT NULL,
    platformId INT NOT NULL  REFERENCES platform (id),
    PRIMARY KEY (id)
  );
`;

const create = `
  INSERT INTO calendar(
    date,
    total,
    platformId
  )
  VALUES (?,?,?);
`;

const get = `
  SELECT
    *
  FROM
    calendar
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    calendar
`;

const betweenDate = `
  SELECT 
    *
  FROM
    calendar
  WHERE
    date >= ?
  AND
    date <= ?
`;

const busiestDayBetweenDate = `
  SELECT 
    total,
    date,
    platformId
  FROM 
    calendar
  WHERE 
    total = (
      SELECT 
        MAX(total)
      FROM
        calendar
      WHERE date >= ?
      AND date <= ?)
  LIMIT 1;
`;

const dayByDate = `
  SELECT
    *
  FROM
    calendar
  WHERE
    date = ?
`;
//#endregion

//#region > Exports
export {
  initialize,
  create,
  get,
  all,
  betweenDate,
  busiestDayBetweenDate,
  dayByDate,
};
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
