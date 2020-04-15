/**
 * #ENTRYPOINT
 * ##
 *  intel = new Intel();
 *  intel.append(ISource);
 *  intel.appendList(ISource[]);
 *  intel.get();
 *  intel.snekClient
 * ##
 */

//#region > Imports

//> snek-client
//#PACKAGE snek-client
//## npm install snek-client
// Contains the clients for API calls to SNEK and GitHub.
import { SnekClient, GithubClient } from "snek-client";


//> Reducer
// Contains the reducer and database models
import { Reducer } from "./reducer";

//> Utils
// Contains the github utils
import * as github from "./utils/github/index";

//> Interfaces
// Contains the profile interface for the profile query result
import { IProfile } from "./utils/github/queries/index";

/** @interface Intel defines the structure of the intel class. */
interface IIntel {
  /**
   * Snekclient: A client implementation for snek interaction from the "snek-client" package.
   */
  snekclient: SnekClient;
  /**
   * @todo Adding error handling.
   * @function
   * @param {ISource} source A source object.
   * @returns {Promise<void>} Empty promise for conformation of completion.
   * @description Append data to the database based on the information in a source object.
   */
  append(source: ISource): Promise<void>;
  /**
   * @todo Adding error handling.
   * @function
   * @param {ISource[]} sources A list of source objects.
   * @returns {Promise<void>} Empty promise for conformation of completion.
   * @description Append data to the databse for n source objects.
   */
  appendList?(sources: ISource[]): Promise<void>;
}

/** @interface Source defines the structure of a source object. */
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

/** @interface DataUser defines the structure of the reponse of the github client. */
interface IDataUser {
  data: {
    /**
     * User: Can contain any information according to a user.
     * The content of this object relays on the query with which the client is addressed.
     */
    user: object;
  };
}
//#endregion

//#region > Classes
/**
 * @class Intel - A place where everything becomes one thing.
 * By using the snek-client, utils and the brand new snek-reducer we
 * created a new way of life.
 * Some might say that this is not perfect in every way. But they are just fools.
 * We know every single mistake, every single scratch.
 * Although we can frankly say, we love it!
 * @implements IIntel
 * @see {@link http://github.com/snek-at/intel/README.md |SNEK Intel README} for further information.
 */
class Intel implements IIntel {
  public snekclient: SnekClient;
  private reducer: Reducer;

  /**
   * @constructor
   * @author Nico Schett <contact@schett.net>
   * @description Creates a Intel instance.
   */
  constructor() {
    // init snekclient
    this.snekclient = new SnekClient();
    // init reducer
    this.reducer = new Reducer();
  }

  /**
   * Get gitlab or github data and fill the models.
   *
   * @param source A source object of type ISource.
   * @description Fill the models with data from github or gitlab. The type and username are specified by the source param.
   */
  async append(source: ISource) {
    let platform = source.platform.name.toLowerCase();

    try {
      if (platform === "github") {
        // Init github client
        /**
         * Use the default client url if none is provided.
         */
        let githubClient: GithubClient;

        if (source.platform.url) {
          githubClient = new GithubClient(source.platform.url);
        } else {
          githubClient = new GithubClient();
        }

        let profileData = (await githubClient.endpoint.send(
          "query",
          github.queries.profile(),
          {
            username: source.user,
          },
          {
            authorization: source.authorization,
          }
        )) as IDataUser;

        let calendarData = (await githubClient.endpoint.send(
          "query",
          github.queries.calendar(profileData.data.user as IProfile),
          {
            username: source.user,
          },
          {
            authorization: source.authorization,
          }
        )) as IDataUser;

        /** @interface Data defines the structure which is requiered to run the github converter.  */
        interface IData {
          /**
           * Profile: A profile object which contains all profile data of a github user.
           */
          profile: object;
          /**
           * Calendar: A calendar object which contains all calendar data of a github user.
           */
          calendar: object;
        }

        const data: IData = {
          profile: profileData.data.user,
          calendar: calendarData.data.user,
        };

        github.converter.run(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Append a list of source objects.
   *
   * @param sources A list of source objects.
   * @description Calls .append() for each source object in the provided list.
   */
  async appendList(sources: ISource[]) {
    for (let source in sources) {
      await this.append(sources[source]);
    }
  }

  /**
   * Get a reduced object.
   *
   * @returns A reduced object.
   * @description Get a reduced object which contains profile, calendar, statistic and language data.
   */
  get() {
    return this.reducer.get();
  }
}
//#endregion

//#region > Exports
export type { Intel };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
