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
    return runner<{
      personProfiles: {
        id: string;
        createdAt: string;
        updatedAt: string;
        username: string;
        accessToken: string;
        sourceType: string;
      }[];
    }>("mutation", mutations.getProfiles, {
      personName: runnerOptions.personName,
    });
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
    return runner<{
      addProfile: { profile: { id: string; createdAt: string } };
    }>("mutation", mutations.addProfile, {
      personName: runnerOptions.personName,
      username: runnerOptions.source.username,
      sourceType: runnerOptions.source.type,
      accessToken: runnerOptions.source.type,
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
    return runner<{
      deleteProfile: { profiles: { id: string }[] };
    }>("mutation", mutations.deleteProfile, {
      profileId: runnerOptions.profileId,
    });
  } catch {
    throw new Error(
      `Couldn't successfully delete profile with Id: ${runnerOptions.profileId}`
    );
  }
};

const updateProfile = (runnerOptions: {
  profileId: number;
  toUpdate: {
    accessToken?: string;
    sourceType?: string;
    username?: string;
  };
}) => {
  try {
    return runner<{}>("mutation", mutations.updateProfile, {
      ...runnerOptions.toUpdate,
    });
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
