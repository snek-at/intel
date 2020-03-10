/*
  Reducing object fields by using a key schema.
*/
function squeezer(obj, keys) {
  if (keys && keys.length > 0) {
    let keysToRemove = Object.keys(obj).filter((x) => !keys.includes(x));

    for (let index = 0; index < keysToRemove.length; index++) {
      const key = keysToRemove[index];
      delete obj[key];
    }
  }

  return obj;
}

export { squeezer };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
