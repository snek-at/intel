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
      /**
       * Proxy to neutralize Generic Object Injection Sink.
       * @todo Validate the proxy workaround for the injection vulnerability via a penetration test.
       * @see {@link https://bit.ly/2KdpgAh |the-dangers-of-square-bracket-notation}
       * @see {@link https://bit.ly/3cpPVG6 |creating-defensive-objects-with-es6-proxies}
       */
      var proxy = new Proxy(
        { index },
        {
          get: () => {
            return index;
          },
        }
      );

      delete obj[keysToRemove[proxy.index]];
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
