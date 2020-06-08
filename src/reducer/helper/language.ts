//#region > Imports
//> Models
// Contains all models of the database
import * as models from "../database/models";
//#endregion

//#region > Functions
/**
 * Get a language statistic over all platforms.
 *
 * @function
 * @returns {models.Language[]} A list of merged language objects
 */
function mergedLanguage() {
  let languages = models.Language.getLanguages();

  languages.map((language: models.Language) => {
    return language.render([]);
  });

  return languages;
}
//#endregion

//#region > Exports
//> Functions
export { mergedLanguage };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
