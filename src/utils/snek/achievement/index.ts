import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";

const all = async () => {
  try {
    const res = await Provider.client.session.runner<{
      achievements: types.GraphQLAchievement[];
    }>("query", queries.getAchievements, {});
    return res.data ? res.data.achievements : [];
  } catch {
    throw new Error(`Couldn't successfully fetch achievements`);
  }
};

export { all };
