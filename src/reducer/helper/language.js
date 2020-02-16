import * as models from "../database/models";

function mergedLanguage() {
  let languages = models.Language.getLanguages();
  languages.map(language => { return language.render()});

  return languages;
}

export { mergedLanguage }

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
