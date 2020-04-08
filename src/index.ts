//> Reducer
// Contains Reducer and database models
import { Reducer } from "./reducer";
//> snek-client
// Contains a interface for the snek-client
//import * as client from "./client";
import { SnekClient, GithubClient } from "snek-client";
//> Utils
// Contains the github utils
import * as github from "./utils/github/index";
import { IProfile } from "./utils/github/queries/index";

interface IReducedData {
  profile: object;
  calendar: object;
  statistic: object;
  language: object;
}

interface IIntel {
  snekclient: SnekClient;
  append(source: ISource): Promise<void>;
  appendList?(sources: ISource[]): Promise<void>;
  get(): IReducedData;
}

interface ISource {
  user: string;
  platform: {
    url: string;
    name: string;
  };
  authorization: string;
}

interface IDataUser {
  data: {
    user: object;
  };
}

interface IData {
  profile: object;
  calendar: object;
}

//> Classes
/**
 * The intel. A place where everything becomes one thing.
 * By using the snek-client, utils and the brand new snek-reducer we
 * created a new way of life.
 * Some might say that this is not perfect in every way. But they are just fools.
 * We know every single mistake, every single scratch.
 * Although we can frankly say, we love it!
 */
export class Intel implements IIntel {
  public snekclient: SnekClient;
  private reducer: Reducer;

  constructor() {
    /**
     * Init clients
     */
    this.snekclient = new SnekClient();

    this.reducer = new Reducer();
  }

  async append(source: ISource) {
    let platform = source.platform.name.toLowerCase();
    try{
      if (platform === "github") {
        // Init github client
        let githubClient = new GithubClient(source.platform.url);
        let profileData = <IDataUser>await githubClient.endpoint.send(
          "query",
          github.queries.profile(),
          {
            username: source.user,
          },
          {
            authorization: source.authorization,
          }
        );
  
        let calendarData = <IDataUser>await githubClient.endpoint.send(
          "query",
          github.queries.calendar(<IProfile>profileData.data.user),
          {
            username: source.user
          },
          {
            authorization: source.authorization,
          }
        );
  
        const data: IData = {
          profile: profileData.data.user,
          calendar: calendarData.data.user
        };
  
        github.converter.run(data);
      }
    } catch (err){
      console.error(err)
    }
  }

  async appendList(sources: ISource[]) {
    for (let source in sources) {
      await this.append(sources[source]);
    }
  }

  get() {
    return <IReducedData>this.reducer.get();
  }
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
