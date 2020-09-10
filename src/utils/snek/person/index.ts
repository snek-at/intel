import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";

import GithubProvider from "../../github";
import GtilabProvider from "../../gitlab";
import InstagramProvider from "../../instagram";
import { Reducer } from "../../../reducer";
import { safelyParseJSON } from "../../../toolbox/Parser";

const allBrief = async (runnerOptions: {}) => {
  try {
    const res = await Provider.client.session.runner<{
      page: { children: types.GraphqlPersonPageBrief[] };
    }>("query", queries.allUserPagesBrief, {});
    return res.data ? res.data.page.children : [];
  } catch {
    throw new Error(`Couldn't successfully fetch all persons brief`);
  }
};

const get = async (runnerOptions: { personName: string }) => {
  try {
    const res = await Provider.client.session.runner<{
      page: types.GraphQLPersonPage;
    }>("query", queries.getPerson, {
      slug: `p-${runnerOptions.personName}`,
    });
    if (res.data) {
      let rnt: Omit<
        types.GraphQLPersonPage,
        "movablePool" | "tids" | "bids"
      > & {
        tids: string[];
        bids: string[];
        movablePool: { [x: string]: any[] }[];
      };

      rnt = {
        ...res.data.page,
        tids: safelyParseJSON(res.data.page.tids, []),
        bids: safelyParseJSON(res.data.page.bids, []),
        movablePool: res.data.page.movablePool.map((e) => {
          return { [e.field]: safelyParseJSON(e.rawValue, []) };
        }),
      };

      return rnt;
    }
    return null;
  } catch {
    throw new Error(
      `Couldn't successfully fetchPerson: ${runnerOptions.personName}`
    );
  }
};

const register = async (runnerOptions: {
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
    const res = await Provider.client.session.runner<{
      registration: { result: string };
    }>("mutation", mutations.registration, {
      values: runnerOptions.formValues,
    });
    return res.data ? res.data.registration : null;
  } catch {
    throw new Error(`Couldn't successfully register new person`);
  }
};

const profiles = async (runnerOptions: { personName: string }) => {
  try {
    const res = await Provider.client.session.runner<{
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
    });
    return res.data ? res.data.personProfiles : [];
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
        busiestDay: statistic.busiestDay,
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

const addProfile = async (runnerOptions: {
  personName: string;
  source: {
    URL: string | undefined;
    type: "GITHUB" | "GITLAB" | "INSTAGRAM";
    /** User: A username of the provided platform */
    username?: string;
    /** Authorization: A token for authorizing the client */
    authorization?: string;
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      addProfile: { profile: { id: string; createdAt: string } };
    }>("mutation", mutations.addProfile, {
      personName: runnerOptions.personName,
      username: runnerOptions.source.username,
      sourceUrl: runnerOptions.source.URL,
      sourceType: runnerOptions.source.type,
      accessToken: runnerOptions.source.authorization,
    });
    return res.data ? res.data.addProfile.profile : null;
  } catch {
    throw new Error(
      `Couldn't successfully add new profile for Person:\
      ${runnerOptions.personName} \
      of Type: ${runnerOptions.source.type}`
    );
  }
};

const deleteProfile = async (runnerOptions: { profileId: number }) => {
  try {
    const res = await Provider.client.session.runner<{
      deleteProfile: { profiles: { id: string }[] };
    }>("mutation", mutations.deleteProfile, {
      profileId: runnerOptions.profileId,
    });
    return res.data ? res.data.deleteProfile.profiles : [];
  } catch {
    throw new Error(
      `Couldn't successfully delete profile with Id: ${runnerOptions.profileId}`
    );
  }
};

const updateProfile = async (runnerOptions: {
  profileId: number;
  toUpdate: {
    accessToken?: string;
    sourceType?: string;
    username?: string;
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      updateProfile: {
        profile: { id: number };
      };
    }>("mutation", mutations.updateProfile, {
      ...runnerOptions.toUpdate,
    });

    return res.data ? res.data.updateProfile.profile : null;
  } catch {
    throw new Error(
      `Couldn't successfully update profile with Id: ${runnerOptions.profileId}`
    );
  }
};

const writeVariableStore = async (runnerOptions: {
  personName: string;
  toStore: {
    currentStatistic?: string;
    yearsStatistic?: string;
    languages?: string;
    organisations?: string;
    projects?: string;
    currentCalendarImage?: File;
    yearsCalendarImages?: File[];
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      variableStore: { person: { id: string } };
    }>("mutation", mutations.writeVariableStore, {
      personName: runnerOptions.personName,
      rawCurrentStatistic: runnerOptions.toStore.currentStatistic,
      rawYearsStatistic: runnerOptions.toStore.yearsStatistic,
      rawLanguages: runnerOptions.toStore.languages,
      rawOrganisations: runnerOptions.toStore.organisations,
      rawProjects: runnerOptions.toStore.projects,
      rawCurrentStatisticImage: runnerOptions.toStore.currentCalendarImage,
      rawYearsStatisticCalendarImages:
        runnerOptions.toStore.yearsCalendarImages,
    });
    return res.data ? res.data.variableStore.person : null;
  } catch {
    throw new Error(
      `Couldn't successfully write the variable store of Person: ${runnerOptions.personName}`
    );
  }
};

const updateSettings = async (runnerOptions: {
  personName: string;
  settings: {
    avatarImage?: File;
    bio?: string;
    display2dCalendar?: string;
    display3dCalendar?: string;
    displayEmail?: string;
    displayProgrammingLanguages?: string;
    displayRanking?: string;
    displayWorkplace?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    location?: string;
    movablePool?: string;
    status?: string;
    websiteUrl?: string;
    workplace?: string;
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      updatePersonPage: { personPage: types.GraphqlPersonPageBrief };
    }>("mutation", mutations.updatePersonPage, {
      personName: runnerOptions.personName,
      ...runnerOptions.settings,
    });

    return res.data ? res.data.updatePersonPage.personPage : null;
  } catch {
    throw new Error(
      `Couldn't successfully update settings of Person: ${runnerOptions.personName}`
    );
  }
};

const addMetaLink = async (runnerOptions: {
  personName: string;
  linkOptions: {
    url: string;
    location: string;
    linkType: types.MetaLinkType;
    imgurDeleteHash: string;
    description: string;
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      addMetaLink: { metaLink: types.GraphQLMetaLink };
    }>("mutation", mutations.addMetaLink, {
      personName: runnerOptions.personName,
      ...runnerOptions.linkOptions,
    });
    return res.data ? res.data.addMetaLink.metaLink : null;
  } catch {
    throw new Error(
      `Couldn't successfully add meta link for Person: ${runnerOptions.personName}`
    );
  }
};

const deleteMetaLink = async (runnerOptions: { metaLinkId: string }) => {
  try {
    const res = await Provider.client.session.runner<{
      deleteMetaLink: { metaLinks: types.GraphQLMetaLink[] };
    }>("mutation", mutations.deleteMetaLink, {
      metaLinkId: runnerOptions.metaLinkId,
    });
    return res.data ? res.data.deleteMetaLink.metaLinks : [];
  } catch {
    throw new Error(
      `Couldn't successfully delete meta link with Id: ${runnerOptions.metaLinkId}`
    );
  }
};

const checkMetaLink = async (runnerOptions: {
  personName: string;
  toCheck: {
    linkType: string;
    url: string;
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      checkPersonPageMetaLink: { exists: boolean };
    }>("mutation", mutations.checkMetaLink, {
      personName: runnerOptions.personName,
      ...runnerOptions.toCheck,
    });
    return res.data ? res.data.checkPersonPageMetaLink : null;
  } catch {
    throw new Error(`Couldn't successfully check meta link`);
  }
};

const getInstagramPosts = async (runnerOptions: { personName: string }) => {
  const instagramProfiles = await profiles({
    personName: runnerOptions.personName,
  });

  const posts = (
    await Promise.all(
      instagramProfiles
        .filter(
          (profile) => profile.isActive && profile.sourceType == "INSTAGRAM"
        )
        .map(async (profile) => {
          const posts = await InstagramProvider.processSource(
            profile.sourceUrl,
            {
              authorization: profile.accessToken,
            }
          );

          return posts.map((res) => {
            return {
              profileId: profile.id,
              ...res,
            };
          });
        })
    )
  ).flat();

  return posts;
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
  deleteMetaLink,
  checkMetaLink,
  getInstagramPosts,
};
