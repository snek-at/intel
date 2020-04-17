//#region > Imports
//> Models
// Contains all models of the database
import * as models from "../database/models";
//#endregion

//#region > Interfaces
/**
 * @interface Platform defines the structure of the platform object.
 * @extends models.Platform A OSM model.
 */
interface IPlatform extends models.Platform {
  /**
   * Sources: A list of objects.
   */
  sources: object[];
  /**
   * Repositories: A list of repository objects.
   */
  repositories: IRepository[];
  /**
   * Organizations: A list of organization objects.
   */
  organizations: IOrganization[];
}

/**
 * @interface Repository defines the structure of the repository object.
 * @extends models.Repository A OSM model.
 */
interface IRepository extends models.Repository {
  /**
   * Owner: A member object.
   */
  owner: models.Member;
  /**
   * Members: A list of member objects.
   */
  members: models.Member[];
  /**
   * Language: A list of language objects.
   */
  languages: models.Language[];
}

/**
 * @interface Organization defines the structure of the organization object.
 * @extends models.Organization A OSM model.
 */
interface IOrganization extends models.Organization {
  /**
   * Members: A list of member objects.
   */
  members: models.Member[];
  /**
   * Repositories: A list of repository objects.
   */
  repositories: IRepository[];
}
//#endregion

//#region > Functions
/**
 * Get merged profile.
 *
 * @returns A merged profile object.
 * @description Get all profile information. Platform nr. 1 is used for general information.
 */
function mergedProfile() {
  let platform = models.Platform.objects.get({ id: 1 }) as IPlatform;
  let repositories = models.Repository.objects.all() as IRepository[];
  let organizations = models.Organization.objects.all() as IOrganization[];

  platform.sources = models.Platform.getSourceTypes();
  platform.repositories = repositories.map((repository) => {
    repository.owner = (models.Member.objects.get({
      id: repository.ownerId,
    }) as models.Member).render([]);
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
    /* 
       Set the organization as owner for each repository within
       the organization. To render a organization as a member
       a list of member keys to render by is defined.
    */
    let owner = organization.render(["avatarUrl", "url", "fullname", "name"]);

    organization.repositories = repositories.map((repository) => {
      /* Pass the organization to member format */
      repository.owner = owner;
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
//#endregion

//#region > Exports
export type { IPlatform };
export { mergedProfile };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
