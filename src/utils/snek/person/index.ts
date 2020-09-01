import Provider from "../index";
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";
//> Reducer
// Contains the reducer and database models
import { Reducer } from "../../../reducer";

const get = (runnerOptions: { personName: string }) => {
  // try {
  //   return Provider.client.session.customTask<{}>("mutation", mutations.follow, {});
  // } catch {
  //   throw new Error(
  //     `Couldn't successfully fetchPerson: ${runnerOptions.personName}`
  //   );
  // }
};

const profiles = (runnerOptions: { personName: string }) => {
  try {
    return Provider.client.session
      .customTask<{
        personProfiles: {
          id: string;
          createdAt: string;
          updatedAt: string;
          username: string;
          accessToken: string;
          sourceUrl: string;
          sourceType: string;
          isActive: boolean;
        }[];
      }>("mutation", queries.getProfiles, {
        personName: runnerOptions.personName,
      })
      .then((res) => (res.data ? res.data : null));
  } catch {
    throw new Error(
      `Couldn't successfully fetch profiles of Person: ${runnerOptions.personName}`
    );
  }
};

const addProfile = (runnerOptions: {
  personName: string;
  source: {
    URL: string | undefined;
    type: "GITHUB" | "GITLAB" | "INSTAGRAM";
    /** User: A username of the provided platform */
    username: string;
    /** Authorization: A token for authorizing the client */
    authorization: string;
  };
}) => {
  try {
    return Provider.client.session
      .customTask<{
        addProfile: { profile: { id: string; createdAt: string } };
      }>("mutation", mutations.addProfile, {
        personName: runnerOptions.personName,
        username: runnerOptions.source.username,
        sourceUrl: runnerOptions.source.URL,
        sourceType: runnerOptions.source.type,
        accessToken: runnerOptions.source.authorization,
      })
      .then((res) => (res.data ? res.data : null));
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
    return Provider.client.session.customTask<{
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
    return Provider.client.session.customTask<{}>(
      "mutation",
      mutations.updateProfile,
      {
        ...runnerOptions.toUpdate,
      }
    );
  } catch {
    throw new Error(
      `Couldn't successfully update profile with Id: ${runnerOptions.profileId}`
    );
  }
};

const writeVariableStore = (runnerOptions: {
  personName: string;
  toStore: {
    currentStatistic?: string;
    yearsStatistic?: string;
    languages?: string;
    organisations?: string;
    projects?: string;
  };
}) => {
  try {
    return Provider.client.session
      .customTask<{
        variableStore: { person: { id: string } };
      }>("mutation", mutations.writeVariableStore, {
        personName: runnerOptions.personName,
        rawCurrentStatistic: runnerOptions.toStore.currentStatistic,
        rawYearsStatistic: runnerOptions.toStore.yearsStatistic,
        rawLanguages: runnerOptions.toStore.languages,
        rawOrganisations: runnerOptions.toStore.organisations,
        rawProjects: runnerOptions.toStore.projects,
      })
      .then((res) => (res.data ? res.data : null));
  } catch {
    throw new Error(
      `Couldn't successfully write the variable store of Person: ${runnerOptions.personName}`
    );
  }
};

const updateSettings = (runnerOptions: {
  personName: string;
  settings: {};
}) => {
  // try {
  //   return Provider.client.session.customTask<{}>("mutation", mutations.follow, {});
  // } catch {
  //   throw new Error(
  //     `Couldn't successfully update profile settings of Person: ${runnerOptions.personName}`
  //   );
  // }
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
  // try {
  //   return Provider.client.session.customTask<{}>("mutation", mutations.follow, {});
  // } catch {
  //   throw new Error(
  //     `Couldn't successfully add meta link for Person: ${runnerOptions.personName}`
  //   );
  // }
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
