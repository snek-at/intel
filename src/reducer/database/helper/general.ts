//#region > Functions
/**
 * Reduce object fields by using a list of keys.
 *
 * @function
 * @param obj A object to squeeze
 * @param keys A list of object keys to filter by
 * @returns {object} The filtered object
 * @todo Implement a way to remove objects/arrays from a object
 * @description Removes every key of an object that does not appear in the
 *              key list.
 */
function squeezer(obj: any, keys?: string[], exclude: string[] = ["objects"]) {
  let keysToRemove: string[] = [];

  if (keys && keys.length > 0) {
    keysToRemove = Object.keys(obj).filter((x) => !keys.includes(x));
  }

  keysToRemove.push(...exclude);

  for (let index = 0; index < keysToRemove.length; index++) {
    /**
     * Proxy to neutralize Generic Object Injection Sink.
     *
     * @todo Validate the proxy workaround for the injection vulnerability via
     *       a penetration test.
     * @see {@link https://bit.ly/2KdpgAh |the-dangers-of-square-bracket-notation}
     * @see {@link https://bit.ly/3cpPVG6 |creating-defensive-objects-with-es6-proxies}
     */
    let proxy = new Proxy(
      { index },
      {
        get: () => {
          return index;
        }
      }
    );

    delete obj[keysToRemove[proxy.index]];
  }

  return obj;
}
//#endregion

//#region > Exports
export { squeezer };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
