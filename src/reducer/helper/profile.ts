//> Imports
// Contains all models of the database.
import * as models from "../database/models";

// Currently there is much redundant code due to the future integration of the playbook.

export interface IPlatform extends models.Platform {
  repositories: IRepository[];
  organizations: IOrganization[];
}

interface IRepository extends models.Repository {
  members: models.Member[];
  languages: models.Language[];
}

interface IOrganization extends models.Organization {
  members: models.Member[];
  repositories: IRepository[];
}

/**
 * Get merged profile.
 *
 * @returns A merged profile.
 * @description Get all profile information. Platform nr. 1 is used for general information.
 */
function mergedProfile() {
  let platform = models.Platform.objects.get({ id: 1 }) as IPlatform;
  console.log(platform);
  let repositories = models.Repository.objects.all() as IRepository[];
  let organizations = models.Organization.objects.all() as IOrganization[];

  platform.repositories = repositories.map((repository) => {
    repository.members = repository.getMembers().map((member) => {
      return member.render([]);
    });
    repository.languages = repository.getLanguages().map((language) => {
      return language.render([]);
    });
    return repository.render([]);
  });

  platform.organizations = organizations.map((organization) => {
    organization.members = organization.getMembers().map((member) => {
      return member.render([]);
    });
    let repositories = organization.getRepositories() as IRepository[];
    organization.repositories = repositories.map((repository) => {
      repository.members = repository.getMembers().map((member) => {
        return member.render([]);
      });
      repository.languages = repository.getLanguages().map((language) => {
        return language.render([]);
      });
      return repository.render([]);
    });
    return organization.render([]);
  });

  platform.render([]);
  return platform;
}

export { mergedProfile };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
