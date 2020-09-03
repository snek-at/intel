import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";

import GithubProvider from "../../github";
import GtilabProvider from "../../gitlab";
import { Reducer } from "../../../reducer";

const allBrief = (runnerOptions: {}) => {
  try {
    return Provider.client.session
      .customTask<{
        pages: types.GraphqlPersonPageBrief[];
      }>("query", queries.allUserPagesBrief, {})
      .then((res) => (res.data ? res.data.pages : []));
  } catch {
    throw new Error(`Couldn't successfully fetch all persons brief`);
  }
};

const get = (runnerOptions: { personName: string }) => {
  try {
    return Provider.client.session
      .customTask<{
        page: types.GraphQLPersonPage;
      }>("query", queries.getPerson, {
        slug: `p-${runnerOptions.personName}`,
      })
      .then((res) => (res.data ? res.data.page : null));
  } catch {
    throw new Error(
      `Couldn't successfully fetchPerson: ${runnerOptions.personName}`
    );
  }
};

const register = (runnerOptions: {
  formValues: {
    /* Values ​​are not camel cases because form values ​​require snake case */
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    redemption_code: string;
  };
}) => {
  try {
    Provider.client.session
      .customTask<{ registration: { result: string } }>(
        "mutation",
        mutations.registration,
        {
          values: runnerOptions.formValues,
        }
      )
      .then((res) => (res.data ? res.data.registration : null));
  } catch {
    throw new Error(`Couldn't successfully register new person`);
  }
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
      .then((res) => (res.data ? res.data.personProfiles : []));
  } catch {
    throw new Error(
      `Couldn't successfully fetch profiles of Person: ${runnerOptions.personName}`
    );
  }
};

const processProfiles = async (runnerOptions: { personName: string }) => {
  const allProfiles = await profiles({
    personName: runnerOptions.personName,
  });

  const reducer = new Reducer();

  /** Resets the database due to the lack of support for multiple instances */
  reducer.reset();

  for (const profileIndex in allProfiles) {
    const profile = allProfiles[profileIndex];

    console.info(
      `processing (${profileIndex + 1}/${
        allProfiles.length
      }) which Active status is: ${profile.isActive}`,
      profile
    );

    if (profile.isActive) {
      try {
        switch (profile.sourceType) {
          case "GITHUB":
            await GithubProvider.processSource(profile.sourceUrl, {
              user: profile.username,
              authorization: profile.accessToken,
            });
            break;
          case "GITLAB":
            await GtilabProvider.processSource(profile.sourceUrl, {
              user: profile.username,
              authorization: profile.accessToken,
            });
            break;
          case "INSTAGRAM":
            break;
        }
      } catch {
        console.warn(
          `Processing profile of Type:${profile.sourceType} failed!`
        );
      }
    }
  }

  console.info(`Generating merged profiles data`);

  const mergedProfiles = await reducer.get();

  const prepareStatisticForVariableStore = (
    statistic: typeof mergedProfiles.statistic.current
  ) => {
    if (statistic) {
      return {
        calendar2d: JSON.stringify(statistic.calendar),
        contributionType2d: JSON.stringify(statistic.contributions),
        totalIssueContributions: statistic.totalIssueContributions,
        totalCommitContributions: statistic.totalCommitContributions,
        totalRepositoryContributions: statistic.totalRepositoryContributions,
        totalPullRequestContributions: statistic.totalPullRequestContributions,
        totalPullRequestReviewContributions:
          statistic.totalPullRequestReviewContributions,
        totalRepositoriesWithContributedIssues:
          statistic.totalRepositoriesWithContributedIssues,
        totalRepositoriesWithContributedCommits:
          statistic.totalRepositoriesWithContributedCommits,
        totalRepositoriesWithContributedPullRequests:
          statistic.totalRepositoriesWithContributedPullRequests,
        currentStreak: statistic.streak.current,
        longestStreak: statistic.streak.longest,
      };
    } else {
      return undefined;
    }
  };

  writeVariableStore({
    personName: runnerOptions.personName,
    toStore: {
      currentStatistic: JSON.stringify(
        prepareStatisticForVariableStore(mergedProfiles.statistic.current)
      ),
      yearsStatistic: JSON.stringify(
        mergedProfiles.statistic.years.map((e) =>
          prepareStatisticForVariableStore(e)
        )
      ),
      languages: JSON.stringify(mergedProfiles.statistic.languages),
      organisations: JSON.stringify(mergedProfiles.profile?.organizations),
      projects: JSON.stringify(mergedProfiles.profile?.repositories),
    },
  }).then((res) =>
    res
      ? console.info(
          `Successfully written variable store for Person: ${runnerOptions.personName}`
        )
      : console.warn(
          `Couldn't successfully write variable store for Person: ${runnerOptions.personName}`
        )
  );
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
      .then((res) => (res.data ? res.data.addProfile.profile : null));
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
    return Provider.client.session
      .customTask<{
        deleteProfile: { profiles: { id: string }[] };
      }>("mutation", mutations.deleteProfile, {
        profileId: runnerOptions.profileId,
      })
      .then((res) => (res.data ? res.data.deleteProfile.profiles : []));
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
      .then((res) => (res.data ? res.data.variableStore.person : null));
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
  allBrief,
  get,
  register,
  profiles,
  processProfiles,
  addProfile,
  deleteProfile,
  updateProfile,
  updateSettings,
  addMetaLink,
};
