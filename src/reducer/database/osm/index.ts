//#region > Imports
//> Models
// Contains all osm models
import * as models from "./models";
//> Reconstructor
// SOAssembler for SO objects
import { SOAssembler } from "./reconstructor";
//#endregion

//#region > Functions
/**
 * Reset all database entries.
 * @function
 * @description Delete all entries from every database table
 */
function reset() {
  /* Select all database tables */
  SOAssembler.database.exec("SHOW TABLES").map((table: any) => {
    /* Remove all entries from a database table */
    SOAssembler.database.exec("DELETE FROM " + table.tableid);
  });
}

//#region > Exports
export { models, reset };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
