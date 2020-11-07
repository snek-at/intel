//#region > Imports
//> SNEK provider
import Provider from "../index";
//> API response interfaces
import * as types from "../types";
//> GraphQL request data
import * as queries from "./queries/data";
//#endregion

//#region > Functions
/**
 * @function getGitlabServer Returns all registered gitlab server
 * @param runnerOptions username
 */
const getGitlabServer = async () => {
  try {
    const res = await Provider.client.session.runner<{
      page: types.GraphQLRegistrationPage;
    }>("query", queries.getGitlabServers, {});

    return res.data ? res.data.page.supportedGitlabs : [];
  } catch {
    throw new Error(`Couldn't successfully fetch gitlab servers`);
  }
};

/**
 * @function checkUserExists Checks if the user already exists
 * @param runnerOptions username
 */
const checkUserExists = async (runnerOptions: { username: string }) => {
  try {
    const res = await Provider.client.session.runner<{
      userExists: boolean;
    }>("query", queries.userExists, { username: runnerOptions.username });

    return res.data ? res.data.userExists : null;
  } catch {
    throw new Error(`Couldn't successfully fetch gitlab servers`);
  }
};
//#endregion

//#region > Exports
export { getGitlabServer, checkUserExists };
//#endregion
