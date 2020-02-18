import { Reducer, models } from "./reducer";
import * as client from "./client";
import * as github from "./utils/github/index";

class Intel {
  constructor() {
    let reducer = new Reducer();
    this.append = async (source) => {
      if (source.platform.toLowerCase() === "github") {
        // Init github client
        let c = new client.Github(source.authorization);

        let profileData = await c.get(github.queries.profile(), {
          username: source.user
        });

        let calendarData = await c.get(
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
    };
    this.appendList = async (sourceList) => {
      const errorList = [];
      async function retry(maxRetries, fn, params) {
        return await fn(...params).catch(() => {
          if (maxRetries <= 0) {
            throw new Error(
              `Could not fetch data after ${maxRetries} retries... Please try again later!`
            );
          }
          return retry(maxRetries - 1, fn, params);
        });
      }

      for (let index = 0; index < sourceList.length; index++) {
        const source = sourceList[index];
        const maxRetries = 5;
        await retry(maxRetries, this.append, [source]).catch(() => {
          errorList.push(source);
        });
      }
      if (errorList.length > 0) {
        throw errorList;
      }
    };
    this.testGet = () => {
      console.log(reducer.get());
    };
  }
}

export { Intel };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
