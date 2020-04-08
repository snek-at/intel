//> Imports
// Contains all models of the database.
import * as models from "../database/models";

/**
 * Get merged language statistic.
 * 
 * @return A merged langauge statistic.
 * @description Get a language statistic over all platforms.
 */
function mergedLanguage() {
  let languages = models.Language.getLanguages();
  languages.map((language:models.Language) => {
    return language.render([]);
  });

  return languages;
}

export { mergedLanguage };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
