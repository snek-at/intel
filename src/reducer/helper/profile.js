//> Database Models
// Contains all database models
import * as models from "../database/models";

// Currently there is much redundant code due to the future integration of the playbook.

/**
 * Providing a merged profile including repositories
 * and organizations.
 */
function mergedProfile() {
  let platform = models.Platform.objects.get({ id: 1 });
  let repositories = models.Repository.objects.all();
  let organizations = models.Organization.objects.all();

  platform.repositories = repositories.map((repository) => {
    repository.members = repository.getMembers().map((member) => {
      return member.render();
    });
    repository.languages = repository.getLanguages().map((language) => {
      return language.render();
    });
    return repository.render();
  });

  platform.organizations = organizations.map((organization) => {
    organization.members = organization.getMembers().map((member) => {
      return member.render();
    });
    organization.repositories = organization
      .getRepositories()
      .map((repository) => {
        repository.members = repository.getMembers().map((member) => {
          return member.render();
        });
        repository.languages = repository.getLanguages().map((language) => {
          return language.render();
        });
        return repository.render();
      });
    return organization.render();
  });

  platform.render();

  return platform;
}

export { mergedProfile };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
