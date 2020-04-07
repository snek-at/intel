import * as models from "../database/models";

// Currently there is much redundant code due to the future integration of the playbook.

function mergedProfile() {
  let platform = models.Platform.objects.get({ id: 1 });
  let repositories = models.Repository.objects.all();
  let organizations = models.Organization.objects.all();

  platform.repositories = repositories.map((repository:any) => {
    repository.members = repository.getMembers().map((member:any) => {
      return member.render();
    });
    repository.languages = repository.getLanguages().map((language: any) => {
      return language.render();
    });
    return repository.render();
  });

  platform.organizations = organizations.map((organization: any) => {
    organization.members = organization.getMembers().map((member: any) => {
      return member.render();
    });
    organization.repositories = organization
      .getRepositories()
      .map((repository: any) => {
        repository.members = repository.getMembers().map((member:any) => {
          return member.render();
        });
        repository.languages = repository.getLanguages().map((language:any) => {
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
 * Copyright © Simon Prast
 */
