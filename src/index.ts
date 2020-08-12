/**
 * #ENTRYPOINT
 * ##
 *  intel = new Intel();
 *  intel.append(ISource);
 *  intel.appendList(ISource[]);
 *  intel.generateTalks(ISource[], organizations?);
 *  intel.appendTalk(file);
 *  intel.getDownloadUrl();
 *  intel.getTalks();
 *  intel.get();
 *  intel.snekClient;
 * ##
 *
 * @see {@link https://github.com/snek-at/intel#usage} for usage
 *      examples.
 */

//#region > Imports
//#PACKAGE "snek-client"
//## npm install "snek-client"@0.1.1
// Contains the clients for API calls to SNEK, Github and GitLab
import { SnekClient, GithubClient, WebClient } from "snek-client";
import gql from "graphql-tag";

//> Reducer
// Contains the reducer and database models
import { Reducer } from "./reducer";
//> Utils
// Contains the github util
import * as github from "./utils/github/index";
// Contains the gitlab util
import * as gitlab from "./utils/gitlab/index";
// Contains the talks util
import * as talks from "./utils/talks/index";
// Contains the upload util
import * as upload from "./utils/upload/index";
// Contains the ops util
import OpsProvider from "./utils/ops/index";
//> Interfaces
// Contains the profile interface for the profile query result
import { IProfile } from "./utils/github/queries/index";
//#endregion

//#region > Interfaces
/** @interface Intel defines the structure of the intel class */
interface IIntel {
  /**
   * Snekclient: A client implementation for snek interaction from the
   *             "snek-client" package.
   */
  snekclient: SnekClient;
  /**
   * @todo Adding error handling
   * @param {ISource} source A source object
   * @returns {Promise<void>} Empty promise for conformation of completion
   * @description Append data to the database based on the information in
   *              a source object.
   */
  append(source: ISource): Promise<void>;
  /**
   * @todo Adding error handling
   * @param {ISource[]} sources A list of source objects
   * @returns {Promise<void>} Empty promise for conformation of completion
   * @description Append data to the database for n source objects
   */
  appendList?(sources: ISource[]): Promise<void>;
}

/** @interface Source defines the structure of a source object */
interface ISource {
  /**
   * User: A username of the provided platform.
   */
  user: string;
  /**
   * Platform: A object containing its url and name.
   */
  platform: {
    /**
     * Optional!
     * Url: A url of the provided platform.
     */
    url?: string;
    /**
     * Name: The name of the platform.
     * It can be chosen according to preferences.
     */
    name: string;
  };
  /**
   * Authorization: A token for authorizing the client.
   */
  authorization: string;
}

/**
 *  @interface DataUser defines the structure of the response from
 *             the github client.
 */
interface IDataUser {
  data: {
    /**
     * User: Can contain any information according to a user.
     *       The content of this object relays on the query with which the
     *       client gets initialized.
     */
    user: object;
  };
}

/**
 * @interface GitHubData defines the structure which is required to run
 *            the github converter.
 */
interface IGitHubData {
  /**
   * Profile: A profile object which contains all profile data of a github user.
   */
  profile: object;
  /**
   * Calendar: A calendar object which contains all calendar data of
   *           a github user.
   */
  calendar: object;
}
//#endregion

//#region > Classes
/**
 * @class Intel - A place where everything becomes one thing.
 *        By using the snek-client, utils and the brand new snek-reducer we
 *        undoubtedly created the best way to process data
 *        in the 21st century.
 * @implements IIntel
 * @see {@link http://github.com/snek-at/intel/README.md |SNEK Intel README}
 *      for further information.
 */
export class Intel implements IIntel {
  public snekclient: SnekClient;
  private reducer: Reducer;

  /**
   * @constructor
   * @author Nico Schett <contact@schett.net>
   */
  constructor() {
    // init snekclient
    this.snekclient = new SnekClient();
    // init reducer
    this.reducer = new Reducer();
  }

  /**
   * Get GitLab or GitHub data and fill the models.
   *
   * @param source A source object of type ISource
   * @description Fill the models with data from GitHub or GitLab.
   *              The type and username are specified by the source param.
   */
  async append(source: ISource) {
    let platform = source.platform.name.toLowerCase();

    try {
      if (platform === "github") {
        // Init github client
        /* Use the default client url if none is provided */
        let githubClient: GithubClient;

        if (source.platform.url) {
          githubClient = new GithubClient(source.platform.url);
        } else {
          githubClient = new GithubClient();
        }

        let profileData = (await githubClient.gql.sendQuery(
          github.queries.profile(),
          {
            username: source.user,
          },
          {
            authorization: source.authorization,
          }
        )) as IDataUser;

        let calendarData = (await githubClient.gql.sendQuery(
          github.queries.calendar(profileData.data.user as IProfile),
          {
            username: source.user,
          },
          {
            authorization: source.authorization,
          }
        )) as IDataUser;

        const data: IGitHubData = {
          profile: profileData.data.user,
          calendar: calendarData.data.user,
        };

        await github.converter.run(data);
      } else if (platform === "gitlab") {
        let gitlabClient: WebClient;

        // Init gitlab client
        /* Use the default client url if none is provided */
        if (source.platform.url) {
          gitlabClient = new WebClient(source.platform.url);
        } else {
          gitlabClient = new WebClient("https://gitlab.com");
        }

        let rawData = {
          platform: {
            name: source.platform.name,
            url: source.platform.url
              ? source.platform.url
              : "https://gitlab.com",
          },
          home: await gitlabClient.scraper.getDom(
            gitlab.paths.home(source.user)
          ),
          atom: await gitlabClient.scraper.getDom(
            gitlab.paths.atom(source.user)
          ),
          currentCalendar: await gitlabClient.scraper.getJson<{
            [index: string]: number;
          }>(gitlab.paths.currentCalendar(source.user)),
          groups: await gitlabClient.scraper.getJson<{ html: string }>(
            gitlab.paths.groups(source.user)
          ),
          projects: await gitlabClient.scraper.getJson<{
            html: string;
          }>(gitlab.paths.projects(source.user)),
          activity: await gitlabClient.scraper.getJson<{
            html: string;
          }>(gitlab.paths.activity(source.user)),
        };

        gitlab.converter.runScraper(rawData);
      }
    } catch (err) {
      //#LEGACY
      //#TODO Implement proper error handling
      //#ERROR
      console.error("intel.append()", err);
    }
  }

  /**
   * Append a list of source objects.
   *
   * @param sources A list of source objects
   * @description Calls .append() for each source object in the provided list
   */
  async appendList(sources: ISource[]) {
    /* Sources which platform name is github should be before others */
    sources = sources.sort((a, b) => {
      const platformNameOrder = ["github", "gitlab"];

      const aPlatformNameIndex = platformNameOrder.indexOf(a.platform.name);
      const bPlatformNameIndex = platformNameOrder.indexOf(b.platform.name);

      return aPlatformNameIndex - bPlatformNameIndex;
    });

    for (let source in sources) {
      await this.append(sources[source]);
    }
  }

  /**
   * @param {ISource[]} sources A list of source objects
   * @param {string[]} organizations A string list of organization names
   * @description Generate talks with provided github source objects and
   *              organizations.
   */
  async generateTalks(sources: ISource[], organizations: string[] = []) {
    /* Check if organizations are provided */
    if (organizations.length === 0) {
      /* Get all github organizations from database */
      organizations = Reducer.models.Organization.objects.filter({
        platformName: "github",
      });

      /* Convert to a organization name list */
      organizations = organizations.map((organization: any) => {
        return organization.name;
      });
    }

    /* Convert to a username list */
    const usernames = sources.map((source) => {
      return source.user;
    });

    await talks.generate({
      /**
       * The authorization token of the first source is used.
       *
       * @todo Use authorization token that is related to a talk
       */
      authorization: sources[0].authorization,
      usernames,
      organizations,
    });
  }

  /**
   * @param {Blob} file A file to be uploaded
   * @description Upload a file to anonfile and add it to models
   */
  async appendTalk(file: Blob) {
    const talk = await upload.anonfiles.uploadFile(file);

    await talks.append(talk);
  }

  /**
   * @param {string} url The url that contains the download URL
   * @returns {string | null} The download URL if available
   * @description Extracts the download URL from a anonfile download site
   */
  async getDownloadUrl(url: string): Promise<string | null> {
    let downloadUrl = await upload.anonfiles.getDownloadUrl(url);

    return downloadUrl;
  }

  /**
   * @returns A list of talk objects
   * @description Delivers all talks from the database
   */
  async getTalks() {
    return this.reducer.getTalks();
  }

  /**
   * Get a reduced object.
   *
   * @returns A reduced object
   * @description Get a reduced object which contains profile and statistic data
   */
  async get() {
    return this.reducer.get();
  }

  /**
   * Reset reducer.
   *
   * @description Reinitialize the reducer. This will erase the whole database
   */
  resetReducer() {
    this.reducer.reset();
  }
}

export class OpsIntel extends Intel {
  public ops = new OpsProvider("");

  // async getEnterprisePages() {
  //   const session = this.snekclient.session;

  //   const query2 = gql`
  //     query getAllCompanyPages {
  //       page(slug: "enterprise-pages") {
  //         children {
  //           title
  //           slug
  //           ... on EnterpriseFormPage {
  //             enterpriseProjects {
  //               name
  //               url
  //               description
  //               ownerName
  //               ownerUsername
  //               ownerEmail
  //               contributors {
  //                 name
  //                 username
  //                 active
  //                 contributionFeed {
  //                   type
  //                   cid
  //                   datetime
  //                   message
  //                   files {
  //                     insertions
  //                     deletions
  //                     path
  //                     rawChanges
  //                   }
  //                 }
  //                 codelanguages {
  //                   name
  //                   color
  //                   insertions
  //                   deletions
  //                 }
  //                 codetransition {
  //                   insertions
  //                   deletions
  //                   datetime
  //                 }
  //               }
  //               contributionFeed {
  //                 type
  //                 cid
  //                 datetime
  //                 message
  //                 files {
  //                   insertions
  //                   deletions
  //                   path
  //                   rawChanges
  //                 }
  //               }
  //               codelanguages {
  //                 name
  //                 color
  //                 insertions
  //                 deletions
  //               }
  //               codetransition {
  //                 insertions
  //                 deletions
  //                 datetime
  //               }
  //             }
  //             enterpriseContributors {
  //               name
  //               username
  //               active
  //               contributionFeed {
  //                 type
  //                 cid
  //                 datetime
  //                 message
  //                 files {
  //                   insertions
  //                   deletions
  //                   path
  //                   rawChanges
  //                 }
  //               }
  //               codelanguages {
  //                 name
  //                 color
  //                 insertions
  //                 deletions
  //               }
  //               codetransition {
  //                 insertions
  //                 deletions
  //                 datetime
  //               }
  //             }
  //             enterpriseContributionFeed {
  //               type
  //               cid
  //               datetime
  //               message
  //               files {
  //                 insertions
  //                 deletions
  //                 path
  //                 rawChanges
  //               }
  //             }
  //             enterpriseCodelanguageStatistic {
  //               name
  //               color
  //               insertions
  //               deletions
  //             }
  //             enterpriseCodetransitionStatistic {
  //               insertions
  //               deletions
  //               datetime
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `;

  //   const node = gql`
  //     query getAllCompanyPages($token: String!) {
  //       page(slug: "enterprise-pages", token: $token) {
  //         children {
  //           name: title
  //           handle: slug
  //         }
  //       }
  //     }
  //   `;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ page: { children: [] } }>("query", node, {})
  //       .then((res) => res.data?.page.children);
  //   });
  // }

  // async getEnterprisePageGeneralContent(slug: string) {
  //   const node = gql`
  //     query enterprisePageContent($slug: String!, $token: String!) {
  //       page(slug: $slug, token: $token) {
  //         ... on EnterpriseFormPage {
  //           name: title
  //           handle: slug
  //           city
  //           zipCode
  //           address
  //           telephone
  //           telefax
  //           whatsappTelephone
  //           whatsappContactline
  //           email
  //           vatNumber
  //           taxId
  //           tradeRegisterNumber
  //           courtOfRegistry
  //           placeOfRegistry
  //           tradeRegisterNumber
  //           ownership
  //           employeeCount
  //           opensourceUrl
  //           recruitingUrl
  //           description
  //           enterpriseContributors {
  //             id
  //           }
  //           enterpriseCodetransitionStatistic {
  //             insertions
  //             deletions
  //             datetime
  //           }
  //         }
  //       }
  //     }
  //   `;
  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ page: { enterpriseCodetransitionStatistic: any[] } }>(
  //         "query",
  //         node,
  //         { slug }
  //       )
  //       .then((res) => {
  //         const result: any[] = [];
  //         const page: any = res?.data?.page;

  //         page.enterpriseCodetransitionStatistic.reduce(function (
  //           res: any,
  //           value: any
  //         ) {
  //           if (!res[value.datetime]) {
  //             res[value.datetime] = {
  //               datetime: value.datetime,
  //               insertions: 0,
  //               deletions: 0,
  //             };
  //             result.push(res[value.datetime]);
  //           }

  //           try {
  //             res[value.datetime].insertions += parseInt(value.insertions);
  //             res[value.datetime].deletions += parseInt(value.deletions);
  //           } catch {}

  //           return res;
  //         },
  //         {});

  //         page.enterpriseCodetransitionStatistic = result;

  //         return page;
  //       });
  //   });
  // }

  // async updateEnterprisePageGeneralContent(
  //   imprint: {
  //     city?: string;
  //     zip_code?: string;
  //     address?: string;
  //     telephone?: string;
  //     telefax?: string;
  //     vat_number?: string;
  //     whatsapp_telephone?: string;
  //     whatsapp_contactline?: string;
  //     tax_id?: string;
  //     trade_register_number?: string;
  //     court_of_registry?: string;
  //     place_of_registry?: string;
  //     ownership?: string;
  //     email?: string;
  //     employee_count?: string;
  //     opensource_url?: string;
  //     recruiting_url?: string;
  //     description?: string;
  //   },
  //   general: { title: string }
  // ) {
  //   const node = gql`
  //     node updateEnterprisePageGeneralContent(
  //       $values: GenericScalar!
  //       $token: String!
  //     ) {
  //       enterpriseFormPage(
  //         values: $values
  //         token: $token
  //         url: "/enterprise-pages/e-sneklab/"
  //       ) {
  //         result
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ enterpriseFormPage: object }>("mutation", node, {
  //         values: {
  //           ...imprint,
  //           ...general,
  //         },
  //       })
  //       .then((res) => res.data?.enterpriseFormPage);
  //   });
  // }

  // async getEnterprisePageProjectsContent(slug: string) {
  //   const node = gql`
  //     query enterprisePageContent($slug: String!, $token: String!) {
  //       page(slug: $slug, token: $token) {
  //         ... on EnterpriseFormPage {
  //           enterpriseProjects {
  //             id
  //             title: name
  //             url
  //             description
  //             ownerName
  //             ownerUsername
  //             ownerEmail
  //             contributors {
  //               name
  //               username
  //               active
  //               contributionFeed {
  //                 type
  //                 cid
  //                 datetime
  //                 message
  //                 files {
  //                   insertions
  //                   deletions
  //                   path
  //                   rawChanges
  //                 }
  //               }
  //               codelanguages {
  //                 name
  //                 color
  //                 insertions
  //                 deletions
  //               }
  //               codetransition {
  //                 insertions
  //                 deletions
  //                 datetime
  //               }
  //             }
  //             contributionFeed {
  //               type
  //               cid
  //               datetime
  //               message
  //               files {
  //                 insertions
  //                 deletions
  //                 path
  //                 rawChanges
  //               }
  //             }
  //             codelanguages {
  //               name
  //               color
  //               insertions
  //               deletions
  //             }
  //             codetransition {
  //               insertions
  //               deletions
  //               datetime
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `;
  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ page: { enterpriseProjects: [] } }>("query", node, {
  //         slug,
  //       })
  //       .then((res) => {
  //         const projects = res.data?.page.enterpriseProjects;

  //         return projects?.map((project: any) => {
  //           const result: any[] = [];
  //           project.codetransition.reduce(function (res: any, value: any) {
  //             if (!res[value.datetime]) {
  //               res[value.datetime] = {
  //                 datetime: value.datetime,
  //                 insertions: 0,
  //                 deletions: 0,
  //               };
  //               result.push(res[value.datetime]);
  //             }

  //             try {
  //               res[value.datetime].insertions += parseInt(value.insertions);
  //               res[value.datetime].deletions += parseInt(value.deletions);
  //             } catch {}

  //             return res;
  //           }, {});

  //           project.codetransition = result;

  //           return project;
  //         });
  //       });
  //   });
  // }

  // async getEnterprisePageUsersContent(slug: string) {
  //   const node = gql`
  //     query enterprisePageContent($slug: String!, $token: String!) {
  //       page(slug: $slug, token: $token) {
  //         ... on EnterpriseFormPage {
  //           enterpriseContributors {
  //             name
  //             username
  //             active
  //             contributionFeed {
  //               type
  //               cid
  //               datetime
  //               message
  //               files {
  //                 insertions
  //                 deletions
  //                 path
  //                 rawChanges
  //               }
  //             }
  //             codelanguages {
  //               name
  //               color
  //               insertions
  //               deletions
  //             }
  //             codetransition {
  //               insertions
  //               deletions
  //               datetime
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `;
  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ page: { enterpriseContributors: [] } }>("query", node, {
  //         slug,
  //       })
  //       .then((res) => {
  //         const users = res.data?.page.enterpriseContributors;

  //         return users?.map((user: any) => {
  //           const result: any[] = [];

  //           user.codetransition.reduce(function (res: any, value: any) {
  //             if (!res[value.datetime]) {
  //               res[value.datetime] = {
  //                 datetime: value.datetime,
  //                 insertions: 0,
  //                 deletions: 0,
  //               };
  //               result.push(res[value.datetime]);
  //             }

  //             try {
  //               res[value.datetime].insertions += parseInt(value.insertions);
  //               res[value.datetime].deletions += parseInt(value.deletions);
  //             } catch {}

  //             return res;
  //           }, {});

  //           user.codetransition = result;

  //           return user;
  //         });
  //       });
  //   });
  // }

  // //> Gitlabs
  // async addGitlab(
  //   active: boolean,
  //   description: string,
  //   enterprisePageSlug: string,
  //   gitlabToken: string,
  //   name: string,
  //   privilegesMode: string,
  //   url: string
  // ) {
  //   const node = gql`
  //     mutation addGitlab(
  //       $token: String!
  //       $active: Boolean!
  //       $description: String!
  //       $enterprisePageSlug: String!
  //       $gitlabToken: String!
  //       $name: String!
  //       $privilegesMode: String!
  //       $url: String!
  //     ) {
  //       addGitlab(
  //         token: $token
  //         active: $active
  //         description: $description
  //         enterprisePageSlug: $enterprisePageSlug
  //         gitlabToken: $gitlabToken
  //         name: $name
  //         privilegesMode: $privilegesMode
  //         url: $url
  //       ) {
  //         gitlab {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ addGitlab: { gitlab: { id: string } } }>(
  //         "mutation",
  //         node,
  //         {
  //           active,
  //           description,
  //           enterprisePageSlug,
  //           gitlabToken,
  //           name,
  //           privilegesMode,
  //           url,
  //         }
  //       )
  //       .then((res) => {
  //         return res.data?.addGitlab.gitlab;
  //       });
  //   });
  // }

  // async deleteGitlab(id: number) {
  //   const node = gql`
  //     mutation deleteGitlab($token: String!, $id: Number!) {
  //       deleteGitlab(token: $token, id: $id) {
  //         success
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ deleteGitlab: { success: boolean } }>("mutation", node, {
  //         id,
  //       })
  //       .then((res) => {
  //         return res.data?.deleteGitlab;
  //       });
  //   });
  // }

  // async updateGitlab(
  //   id: number,
  //   active?: boolean,
  //   description?: string,
  //   enterprisePageSlug?: string,
  //   token?: string,
  //   name?: string,
  //   privilegesMode?: string,
  //   url?: string
  // ) {
  //   const node = gql`
  //     mutation updateGitlab(
  //       $token: String!
  //       $id: Int!
  //       $active: Boolean!
  //       $description: String!
  //       $enterprisePageSlug: String!
  //       $gitlabToken: String
  //       $name: String!
  //       $privilegesMode: String!
  //       $url: String!
  //     ) {
  //       updateGitlab(
  //         token: $token
  //         id: $id
  //         active: $active
  //         description: $description
  //         enterprisePageSlug: $enterprisePageSlug
  //         gitlabToken: $gitlabToken
  //         name: $name
  //         privilegesMode: $privilegesMode
  //         url: $url
  //       ) {
  //         gitlab {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ updateGitlab: { gitlab: { id: number } } }>(
  //         "mutation",
  //         node,
  //         {
  //           id,
  //           active,
  //           description,
  //           enterprisePageSlug,
  //           gitlabToken: token,
  //           name,
  //           privilegesMode,
  //           url,
  //         }
  //       )
  //       .then((res) => {
  //         return res.data?.updateGitlab.gitlab;
  //       });
  //   });
  // }

  // async getGitlabs() {
  //   const node = gql`
  //     query getGitlabs($token: String!) {
  //       gitlabs(token: $token) {
  //         id
  //         name
  //         description
  //         url
  //         token
  //         created
  //         updated
  //         active
  //         enterprisePage {
  //           title
  //           slug
  //         }
  //         privilegesMode
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ gitlabs: [] }>("query", node, {})
  //       .then((res) => {
  //         return res.data?.gitlabs;
  //       });
  //   });
  // }

  // //> Pipelines
  // async addPipeline(
  //   enterprisePageSlug: string,
  //   active: boolean,
  //   name: string = "Snek In The Pipeline",
  //   description: string = "You hadn't provide some parameters." +
  //     " Therefore there is some dummy data. :)"
  // ) {
  //   const node = gql`
  //     mutation addPipeline(
  //       $token: String!
  //       $enterprisePageSlug: String!
  //       $name: String!
  //       $description: String!
  //       $active: Boolean!
  //     ) {
  //       addPipeline(
  //         token: $token
  //         enterprisePageSlug: $enterprisePageSlug
  //         name: $name
  //         description: $description
  //         active: $active
  //       ) {
  //         pipeline {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ addPipeline: { pipeline: { id: string } } }>(
  //         "mutation",
  //         node,
  //         {
  //           enterprisePageSlug,
  //           active,
  //           name,
  //           description,
  //         }
  //       )
  //       .then((res) => {
  //         return res.data?.addPipeline.pipeline;
  //       });
  //   });
  // }

  // async deletePipeline(id: string) {
  //   const node = gql`
  //     mutation deletePipeline($token: String!, $id: String!) {
  //       deletePipeline(token: $token, id: $id) {
  //         success
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ deletePipeline: { success: boolean } }>(
  //         "mutation",
  //         node,
  //         {
  //           id,
  //         }
  //       )
  //       .then((res) => {
  //         return res.data?.deletePipeline;
  //       });
  //   });
  // }

  // async updatePipeline(
  //   id: number,
  //   active?: boolean,
  //   description?: string,
  //   enterprisePageSlug?: string,
  //   name?: string
  // ) {
  //   const node = gql`
  //     mutation updatePipeline(
  //       $token: String!
  //       $id: String!
  //       $active: Boolean!
  //       $description: String!
  //       $enterprisePageSlug: String!
  //       $name: String!
  //     ) {
  //       updatePipeline(
  //         token: $token
  //         id: $id
  //         active: $active
  //         description: $description
  //         enterprisePageSlug: $enterprisePageSlug
  //         name: $name
  //       ) {
  //         pipeline {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ updatePipeline: { pipeline: { id: string } } }>(
  //         "mutation",
  //         node,
  //         {
  //           id,
  //           active,
  //           description,
  //           enterprisePageSlug,
  //           name,
  //         }
  //       )
  //       .then((res) => {
  //         return res.data?.updatePipeline.pipeline;
  //       });
  //   });
  // }

  // async getPipelines() {
  //   const node = gql`
  //     query getPipelines($token: String!) {
  //       pipelines(token: $token) {
  //         id
  //         name
  //         description
  //         active
  //         created
  //         updated
  //         enterprisePage {
  //           title
  //           slug
  //         }
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ pipelines: [] }>("query", node, {})
  //       .then((res) => {
  //         return res.data?.pipelines;
  //       });
  //   });
  // }

  // //> Connectors
  // async addConnector(
  //   active: boolean,
  //   url: string,
  //   name: string,
  //   description: string,
  //   connectorToken: string,
  //   enterprisePageSlug: string,
  //   privilegesMode: string,
  //   settings: {},
  //   shareMode: string
  // ) {
  //   const node = gql`
  //     mutation addConnector(
  //       $token: String!
  //       $active: Boolean!
  //       $url: String!
  //       $name: String!
  //       $description: String!
  //       $connectorToken: String!
  //       $enterprisePageSlug: String!
  //       $privilegesMode: String!
  //       $settings: GenericScalar
  //       $shareMode: String!
  //     ) {
  //       addConnector(
  //         token: $token
  //         active: $active
  //         url: $url
  //         name: $name
  //         description: $description
  //         connectorToken: $connectorToken
  //         enterprisePageSlug: $enterprisePageSlug
  //         privilegesMode: $privilegesMode
  //         settings: $settings
  //         shareMode: $shareMode
  //       ) {
  //         connector {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ addConnector: { connector: { id: string } } }>(
  //         "mutation",
  //         node,
  //         {
  //           active,
  //           url,
  //           name,
  //           description,
  //           connectorToken,
  //           enterprisePageSlug,
  //           privilegesMode,
  //           settings,
  //           shareMode,
  //         }
  //       )
  //       .then((res) => {
  //         return res.data?.addConnector.connector;
  //       });
  //   });
  // }

  // async deleteConnector(id: number) {
  //   const node = gql`
  //     mutation deleteConnector($token: String!, $id: Int!) {
  //       deleteConnector(token: $token, id: $id) {
  //         success
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ deleteConnector: { success: boolean } }>(
  //         "mutation",
  //         node,
  //         {
  //           id,
  //         }
  //       )
  //       .then((res) => {
  //         return res.data?.deleteConnector;
  //       });
  //   });
  // }

  // async updateConnector(
  //   id: number,
  //   active?: boolean,
  //   connectorToken?: string,
  //   description?: string,
  //   enterprisePageSlug?: string,
  //   name?: string,
  //   privilegesMode?: string,
  //   settings?: {},
  //   shareMode?: string,
  //   url?: string
  // ) {
  //   const node = gql`
  //     mutation updateConnector(
  //       $token: String!
  //       $id: Int!
  //       $active: Boolean!
  //       $connectorToken: String!
  //       $description: String!
  //       $enterprisePageSlug: String!
  //       $name: String!
  //       $settings: GenericScalar!
  //       $shareMode: String!
  //       $url: String!
  //     ) {
  //       updateConnector(
  //         token: $token
  //         id: $id
  //         active: $active
  //         connectorToken: $connectorToken
  //         description: $description
  //         enterprisePageSlug: $enterprisePageSlug
  //         name: $name
  //         settings: $settings
  //         shareMode: $shareMode
  //         url: $url
  //       ) {
  //         connector {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ updateConnector: { connector: { id: number } } }>(
  //         "mutation",
  //         node,
  //         {
  //           id,
  //           active,
  //           connectorToken,
  //           description,
  //           enterprisePageSlug,
  //           name,
  //           privilegesMode,
  //           settings,
  //           shareMode,
  //           url,
  //         }
  //       )
  //       .then((res) => {
  //         return res.data?.updateConnector.connector;
  //       });
  //   });
  // }

  // async getConnectors() {
  //   const node = gql`
  //     query getConnectors($token: String!) {
  //       connectors(token: $token) {
  //         id
  //         name
  //         description
  //         url
  //         token
  //         created
  //         updated
  //         active
  //         enterprisePage {
  //           title
  //           slug
  //         }
  //         privilegesMode
  //         shareMode
  //         shareProjects
  //         shareUsers
  //         shareCompanyName
  //         shareCompanyRecruiting
  //         shareCompanyRecruementUrl
  //         shareCompanyDescription
  //         shareCompanyEmployeesCount
  //         shareCompanyVat
  //         shareCompanyEmail
  //         shareCompanyOpensourceStatus
  //         shareCompanyOpensourceUrl
  //       }
  //     }
  //   `;

  //   const session = this.snekclient.session;

  //   return session.begin().then(async () => {
  //     return session
  //       .customTask<{ connectors: [] }>("query", node, {})
  //       .then((res) => {
  //         return res.data?.connectors;
  //       });
  //   });
  // }
}
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
