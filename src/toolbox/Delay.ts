//#region > Functions
/**
 * @function
 * @param {number} ms A time in milliseconds
 * @returns {Promise<unknown>} A timeout promise
 * @description A function to set a timeout
 */
function Delay(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
//#endregion

//#region > Exports
export default Delay;
//#endregion
