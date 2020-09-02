import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";

interface RunnerParameters {}

const all = () => {
  const type = "fetch";

  try {
    return Provider.client.session
      .customTask<{
        achievements: types.GraphQLAchievement[];
      }>("query", queries.getAchievements, {})
      .then((res) => (res.data ? res.data.achievements : []));
  } catch {
    throw new Error(`Couldn't successfully ${type} achievements`);
  }
};

export { all };
