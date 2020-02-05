import * as insert from "./statements/insert";

class Inserter {
  constructor(db) {
    this.db = db;
  }

  platform(fields) {
    this.db.exec(insert.platform, fields)
  }

  organization(fields) {
    this.db.exec(insert.organization, fields)
  }

  member(fields) {
    this.db.exec(insert.member, fields)
  }

  organizationHasMember(fields) {
    this.db.exec(insert.organizationHasMember, fields)
  }

  repositoryHasMember(fields) {
    this.db.exec(insert.repositoryHasMember, fields)
  }

  platformHasOrganization(fields) {
    this.db.exec(insert.platformHasOrganization, fields)
  }

  calendar(fields) {
    this.db.exec(insert.calendar, fields)
  }

  language(fields) {
    this.db.exec(insert.language, fields)
  }

  repository(fields) {
    this.db.exec(insert.repository, fields)
  }

  platformHasRepository(fields) {
    this.db.exec(insert.platformHasRepository, fields)
  }

  statistic(fields) {
    this.db.exec(insert.statistic, fields)
  }

  streak(fields) {
    this.db.exec(insert.streak, fields)
  }

}

export { Inserter }

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
