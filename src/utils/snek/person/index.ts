import Provider from "../index";
import * as mutations from "./mutations/data";

const runner = Provider.client.session.customTask;

const get = (runnerOptions: { personName: string }) => {
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully fetchPerson: ${runnerOptions.personName}`
    );
  }
};

const profiles = (runnerOptions: { personName: string }) => {
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully fetch profiles of Person: ${runnerOptions.personName}`
    );
  }
};

const addGithubProfile = (runnerOptions: {
  personName: string;
  source: {
    /** User: A username of the provided platform */
    user: string;
    /** Authorization: A token for authorizing the client */
    authorization: string;
  };
}) => {
  //> Fetch Data from Github
  try {
    console.log("Intel process Github");
  } catch {
    throw new Error(
      `Couldn't successfully process new Github profile of Person: ${runnerOptions.personName}`
    );
  }

  //> Store Profile in Engine
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully store new Github profile of Person: ${runnerOptions.personName}`
    );
  }
};

const addGitlabProfile = (runnerOptions: {
  personName: string;
  source: {
    /** User: A username of the provided platform */
    user: string;
    /** Authorization: A token for authorizing the client */
    authorization: string;
  };
}) => {
  //> Fetch Data from Gitlab

  try {
    console.log("Intel process Gilab");
  } catch {
    throw new Error(
      `Couldn't successfully process new Gitlab profile of Person: ${runnerOptions.personName}`
    );
  }

  //> Store Profile in Engine
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully store new Gitlab profile of Person: ${runnerOptions.personName}`
    );
  }
};

const addInstagramProfile = (runnerOptions: {
  personName: string;
  source: {
    /** User: A username of the provided platform */
    user: string;
    /** Authorization: A token for authorizing the client */
    authorization: string;
  };
}) => {
  //> Fetch Data from Instagram

  try {
    console.log("Process Instagram");
  } catch {
    throw new Error(
      `Couldn't successfully process new Instagram profile of Person: ${runnerOptions.personName}`
    );
  }

  //> Store Profile in Engine
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully store new Gitlab profile of Person: ${runnerOptions.personName}`
    );
  }
};

const deleteProfile = (runnerOptions: { profileId: number }) => {
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully delete profile with Id: ${runnerOptions.profileId}`
    );
  }
};

const updateProfile = (runnerOptions: {
  personName: string;
  profileId: number;
  update: {};
}) => {
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully update profile with Id: ${runnerOptions.profileId}`
    );
  }
};

const updateSettings = (runnerOptions: {
  personName: string;
  settings: {};
}) => {
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully update profile settings of Person: ${runnerOptions.personName}`
    );
  }
};

const addMetaLink = (runnerOptions: {
  personName: string;
  linkOptions: {
    url: string;
    link_type: string;
    location: string;
    description: string;
  };
}) => {
  try {
    return runner<{}>("mutation", mutations.follow, {});
  } catch {
    throw new Error(
      `Couldn't successfully add meta link for Person: ${runnerOptions.personName}`
    );
  }
};

export {
  get,
  profiles,
  addGithubProfile,
  addGitlabProfile,
  addInstagramProfile,
  deleteProfile,
  updateProfile,
  updateSettings,
  addMetaLink,
};
