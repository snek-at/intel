//#region > Imports
//## npm install snek-client
// Contains a client for web calls
import { WebClient } from "snek-client";

//> Paths
// Contains all path variables
import * as paths from "./paths";
//> Converter
// Contains all provided converters for Github Talk data
import * as converter from "./converter";
//#endregion

//#region > Interfaces
/**
 * @interface Source defines the structure of a source object which is required
 *                   to query talks.
 */
interface ISource {
  /**
   * Authorization: A token for authorizing the client
   */
  authorization: string;
  /**
   * Usernames: A string list containing usernames
   */
  usernames: string[];
  /**
   * Organization: A string list containing organization names
   */
  organizations: string[];
}
//#endregion

//#region > Functions
/**
 *
 * @param {ISource} source A source object which must contain authorization,
 *                         usernames and organizations.
 * @description Provides all github talks of provided usernames and
 *              organizations.
 */
async function generate(source: ISource) {
  const client = new WebClient("https://api.github.com/", {
    authorization: source.authorization,
  });

  const run = async (name: string, user: boolean = true) => {
    /* Page Number */
    let pn = 1;
    /* A counter of the already fetched items */
    let currentItems = 0;
    /* The total amount of items to fetch */
    let totalItems = 1;

    while (currentItems < totalItems) {
      let path;

      if (user) {
        path = paths.user(name, pn);
      } else {
        path = paths.organization(name, pn);
      }

      await client.scraper
        .getJson<{
          items: [];
          total_count: 0;
        }>(path)
        .then(async (response) => {
          totalItems = response.total_count;
          currentItems += response.items.length;

          await converter.run({ talks: response.items });

          pn++;
        })
        .catch((err) => {
          /*
           * Set currentItems equal to to totalItem in order to skip
           * the failed request.
           */
          currentItems = totalItems;

          console.error("TALKS QUERY" + JSON.stringify(err));
        });
    }
  };

  /* Loop all usernames */
  for (const index in source.usernames) {
    await run(source.usernames[index]);
  }

  /* Loop all organizations */
  for (const index in source.organizations) {
    await run(source.organizations[index], false);
  }
}

/**
 * @function
 * @param {object} talk A object containing specific talk information
 * @description Append a single talk
 */
async function append(talk: object) {
  await converter.run({ talks: [talk] });
}
//#endregion

//#region > Exports
export { generate, append };
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
