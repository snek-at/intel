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
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
