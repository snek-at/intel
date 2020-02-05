import { Database as AlasqlDB } from "alasql";
import { Inserter } from "./inserter";
import { Selector } from "./selector";
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
    try {
      let database = new AlasqlDB(name);
      database.exec(tables);

      // Access sql statements
      this.insert = new Inserter(database);
      this.select = new Selector(database);
    } catch (err) {
      throw err; //new Error("Error occurred when initializing database")
    }
  }
}

export { Database };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
