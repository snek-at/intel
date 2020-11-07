//#region > Imports
//> SNEK provider
import Provider from "../index";
//> API response interfaces
import * as types from "../types";
//> GraphQL request data
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";
//#endregion

//#region > Functions
/**
 * @function all returns all achievements
 */
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

/**
 * @function redeem redeems a achievement
 * @param runnerOptions Achievement sequence and name of the person
 */
const redeem = async (runnerOptions: {
  personName: string;
  sequence: string;
}) => {
  try {
    const res = await Provider.client.session.runner<{
      redeemAchievement: { ok: boolean; achievement: types.GraphQLAchievement };
    }>("mutation", mutations.redeem, {
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
//#endregion

//#region > Exports
export { all, redeem };
//#endregion
