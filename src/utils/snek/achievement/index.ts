import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";
import * as mutation from "./mutations/data";

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

const redeem = async (runnerOptions: {
  personName: string;
  sequence: string;
}) => {
  try {
    const res = await Provider.client.session.runner<{
      redeemAchievement: { ok: boolean; achievement: types.GraphQLAchievement };
    }>("mutation", mutation.redeem, {
      personName: runnerOptions.personName,
      sequence: runnerOptions.sequence,
    });
    return res.data
      ? res.data.redeemAchievement
      : { ok: false, achievement: null };
  } catch {
    throw new Error(`Couldn't successfully redeem achievement`);
  }
};

export { all, redeem };
