import Provider from "../index";
import * as mutations from "./mutations/data";
//> Reducer
// Contains the reducer and database models
import { Reducer } from "../../../reducer";

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

const addProfile = (runnerOptions: {
  personName: string;
  source: {
    type: "GITHUB" | "GITLAB" | "INSTAGRAM";
    /** User: A username of the provided platform */
    username: string;
    /** Authorization: A token for authorizing the client */
    authorization: string;
  };
}) => {
  try {
    return runner<{}>("mutation", mutations.addProfile, {
      person_name: runnerOptions.personName,
      profile_type: runnerOptions.source.type,
      profile_token: runnerOptions.source.type,
    });
  } catch {
    throw new Error(
      `Couldn't successfully add new profile for Person:\
      ${runnerOptions.personName} \
      of Type: ${runnerOptions.source.type}`
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
  addProfile,
  deleteProfile,
  updateProfile,
  updateSettings,
  addMetaLink,
};
