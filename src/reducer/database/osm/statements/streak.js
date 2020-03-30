const initialize = `
  DROP TABLE IF EXISTS streak ;
  CREATE TABLE IF NOT EXISTS streak (
    id INT NOT NULL AUTO_INCREMENT,
    startDate DATE NULL,
    endDate DATE NULL,
    total INT NULL,
    statistic_id INT NOT NULL REFERENCES statistic(id),
    PRIMARY KEY (id)
  );
`;

const create = `
  INSERT INTO streak(
    startDate,
    endDate,
    total,
    statistic_id
  )
  VALUES (?,?,?,?);
`;

const get = `
  SELECT
    *
  FROM
    streak
  WHERE
    id=?
`;

const all = `
  SELECT
    *
  FROM
    streak
`;

export { initialize, create, get, all };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
