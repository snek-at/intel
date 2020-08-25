//#region > Imports
//#PACKAGE "snek-client"
// Contains the clients for API calls to SNEK, Github and GitLab
import { GithubClient } from "snek-client";
//> Queries
// Serves generated queries
import * as queries from "./queries";
//> Converter
// Contains a converter which uses database models
import * as converter from "./converter";
//#endregion

//#region > Interfaces
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
class Provider {
  static processSource = async (
    githubUrl: string,
    source: {
      /** User: A username of the provided platform */
      user: string;
      /** Authorization: A token for authorizing the client */
      authorization: string;
    }
  ) => {
    const githubClient = new GithubClient(githubUrl);

    let profileData = (await githubClient.gql.sendQuery(
      queries.profile(),
      {
        username: source.user,
      },
      {
        authorization: source.authorization,
      }
    )) as IDataUser;

    let calendarData = (await githubClient.gql.sendQuery(
      queries.calendar(profileData.data.user as queries.IProfile),
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

    await converter.run(data);
  };
}
//#endregion

//#region > Exports
export default Provider;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
