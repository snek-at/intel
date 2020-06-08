//#region > Functions
/**
 * @function
 * @param {number} ms A time in milliseconds
 * @returns {Promise<unknown>} A timeout promise
 * @description A function to set a timeout
 * @todo Test what's the perfect delay to optimize query speed.
 */
function Delay(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
//#endregion

//#region > Exports
//> Default Function
export default Delay;
//#endregion
