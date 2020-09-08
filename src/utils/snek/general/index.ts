import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";

const getGitlabServer = async (runnerOptions: {}) => {
  try {
    const res = await Provider.client.session.runner<{
      page: types.GraphQLRegistrationPage;
    }>("query", queries.getGitlabServers, {});

    return res.data ? res.data.page.supportedGitlabs : [];
  } catch {
    throw new Error(`Couldn't successfully fetch gitlab servers`);
  }
};

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

export { getGitlabServer, checkUserExists };
