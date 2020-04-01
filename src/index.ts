//> Reducer
// Contains Reducer and database models
import { Reducer, models } from "./reducer";
//> snek-client
// Contains a interface for the snek-client
//import * as client from "./client";
import { Client } from "snek-client";
//> Utils
// Contains the github utils
import * as github from "./utils/github/index";

interface IReducedData {
  profile: object;
  calendar: object;
  statistic: object;
  language: object
}

interface IIntel {
  snekclient: Client;
  append(source: ISource): Promise<void>;
  appendList?(sources: ISource[]): Promise<void>;
  get(): IReducedData;
}

interface ISource {
  user: string;
  platform: string;
  authorization: string;
}

interface IData {
  data: {
    user: object;
  }
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
  public snekclient: Client;
  private githubclient: Client;
  private reducer: Reducer;

  constructor() {
    this.snekclient = new Client({
      url: "https://engine.snek.at/api/graphiql",
      type: "graphql",
      headers: {}
    });
    this.githubclient = new Client({
      url: "https://api.github.com/graphql",
      type: "graphql",
      headers: {}
    });
    this.reducer = new Reducer();
  }

  async append(source: ISource) {
    if (source.platform.toLowerCase() === "github") {
      // Init github client
      //let c = new client.Github(source.authorization);
      let ghs = this.githubclient.session;

      let profileData = <IData>await this.githubclient.session.send(
        source.authorization,
        github.queries.profile(),
        {
          username: source.user
        }
      );

      let calendarData = <IData>await this.githubclient.session.send(
        source.authorization,
        github.queries.calendar(profileData.data.user),
        {
          username: source.user
        }
      );

      const data = {
        profile: profileData.data.user,
        calendar: calendarData.data.user
      };

      github.converter.run(models, data);
    }
  }

  async appendList(sources: ISource[]){
    for(let source in sources){
      await this.append(sources[source])
    }
  }

  get() {
    return <IReducedData>this.reducer.get();
  };
}

// let i = new Intel();
// i.append({
//   user: "Pinterid",
//   platform: "github",
//   authorization: "token 1109d533eec6cbbce9d801131dcfc5583fbc4be1"
// }).then(res => {
//   console.log(i.get())n
// })
/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
