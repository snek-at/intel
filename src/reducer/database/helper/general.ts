//#region > Functions
/**
 * Reduce object fields by using a list of keys.
 *
 * @param obj A object to squeeze.
 * @param keys A list of object keys to filter by.
 * @returns {object} The filtered object.
 * @description Removes every key of an object that does not appear in the key list.
 */
function squeezer(obj: any, keys?: string[]) {
  if (keys && keys.length > 0) {
    let keysToRemove = Object.keys(obj).filter((x) => !keys.includes(x));

    for (let index = 0; index < keysToRemove.length; index++) {
      const key = keysToRemove[index];

      delete obj[key];
    }
  }

  return obj;
}
//#endregion

//#region > Exports
export { squeezer };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
