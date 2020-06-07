//#region > Imports
//> Models
// Contains the repository and talk model of the database
import { Repository, Talk } from "../database/models";
//#endregion

//#region > Interfaces
/** @interface Talk defines the structure of a talk object */
interface ITalk extends Talk {
  /**
   * Repository: The repository object which contains the talk.
   */
  repository: Repository;
  /**
   * //#LEGACY
   * @todo Move this to snek-at/engine
   * Uid: A temporary random string to identify a talk.
   */
  uid: string;
}
//#endregion

//#region > Functions
/**
 * @function
 * @param {number} length A number which represents the length of the unique id
 * @returns A random unique id
 * @description Generates a random unique id with a specific length
 */
function randomUid(length: number) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let index = 0; index < length; index++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

/**
 * @function
 * @returns A list of talk objects
 * @description Get all talk objects within the database
 */
function mergedTalks() {
  let talks: ITalk[] = Talk.objects.all();

  talks.map((talk) => {
    talk.repository = talk.getRepository().render([]);
    talk.uid = randomUid(11);
    talk.render(
      /* No filters are applied here */
      [],
      /* Excluding the following fields in the repository object */
      ["repositoryData", "objects"]
    );
  });

  return talks;
}
//#endregion

//#region > Exports
// Interface
export type { ITalk };
// Functions
export { mergedTalks };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
