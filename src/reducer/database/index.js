import { Database as alasqlDB } from "alasql"
import { Inserter } from "./inserter";
import { Selecter } from "./selector";
import * as create from "./statements/create";

const tables = `
    ${create.platform}
    ${create.organization}
    ${create.member}
    ${create.repository}
    ${create.language}
    ${create.calendar}
    ${create.contribution}
    ${create.statistic}
    ${create.streak}
    ${create.platformHasOrganization}
    ${create.platformHasRepository}
    ${create.organizationHasMember}
    ${create.repositoryHasMember}
`;

class Database {
  constructor(name) {
    try{
        let database = new alasqlDB(name);
        database.exec(tables)

        // Access sql statements
        this.insert = new Inserter(database);
        this.select = new Selecter(database);
    }
    catch(err){
      throw err //new Error("Error occurred when initializing database")
    }
  }
}

export { Database }

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
