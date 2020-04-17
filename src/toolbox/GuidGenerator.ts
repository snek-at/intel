//#region > Functions
/**
 * @function Generate random guid string.
 * @returns {string} A guid string.
 * @description This function generates a random guid string.
 */
function GuidGenerator() {
  let d = new Date().getTime();

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (d + Math.random() * 16) % 16 | 0;

    d = Math.floor(d / 16);

    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
//#endregion

//#region > Export
export default GuidGenerator;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
