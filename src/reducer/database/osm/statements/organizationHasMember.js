const initialize = `
  DROP TABLE IF EXISTS organization_has_member ;
  CREATE TABLE IF NOT EXISTS organization_has_member (
    organization_id INT NOT NULL REFERENCES organization (id),
    member_id INT NOT NULL  REFERENCES member (id),
    PRIMARY KEY (organization_id, member_id)
  );
`;

const create = `
  INSERT INTO organization_has_member(
    organization_id,
    member_id
  )
  VALUES (?,?);
`;

const all = `
  SELECT
    *
  FROM
    organization_has_member
  INNER JOIN
    member m
      ON member_id = m.id
`;

export {initialize, create, all};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
