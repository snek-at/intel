//#region > Imports
//#PACKAGE "snek-client"
// Contains the clients for API calls to SNEK, Github and GitLab
import { WebClient } from "snek-client";
//> Paths
// Contains all path variables
import * as paths from "./paths";
//> Converter
// Contains all provided converters for GitLab data
import * as converter from "./converter";
//#endregion

//#region > Classes
class Provider {
  static processSource = async (
    gitlabUrl: string,
    source: {
      /** User: A username of the provided platform */
      user: string;
      /** Authorization: A token for authorizing the client */
      authorization: string;
    }
  ) => {
    const gitlabClient = new WebClient(gitlabUrl);

    let rawData = {
      platform: {
        name: "gitlab",
        url: gitlabUrl,
      },
      home: await gitlabClient.scraper.getDom(paths.home(source.user)),
      atom: await gitlabClient.scraper.getDom(paths.atom(source.user)),
      currentCalendar: await gitlabClient.scraper.getJson<{
        [index: string]: number;
      }>(paths.currentCalendar(source.user)),
      groups: await gitlabClient.scraper.getJson<{ html: string }>(
        paths.groups(source.user)
      ),
      projects: await gitlabClient.scraper.getJson<{
        html: string;
      }>(paths.projects(source.user)),
      activity: await gitlabClient.scraper.getJson<{
        html: string;
      }>(paths.activity(source.user)),
    };

    converter.runScraper(rawData);
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
