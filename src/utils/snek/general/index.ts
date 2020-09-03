import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";

const getGitlabServer = (runnerOptions: {}) => {
  try {
    return Provider.client.session
      .customTask<{
        page: types.GraphQLRegistrationPage;
      }>("query", queries.getGitlabServers, {})
      .then((res) => (res.data ? res.data.page.supportedGitlabs : []));
  } catch {
    throw new Error(`Couldn't successfully fetch gitlab servers`);
  }
};

export { getGitlabServer };