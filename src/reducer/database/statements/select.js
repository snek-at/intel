const basePlatform = `
  SELECT *
  FROM platform
  WHERE platformName = "github";
`;

const platformTypes = `
  SELECT platformName, platformUrl, count(id) as total
  FROM platform
  GROUP BY platformName, platformUrl
`;

export {
  basePlatform,
  platformTypes
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
