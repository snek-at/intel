//#region > Imports
//> Intel reducer
// Contains the reducer and database models
import { Reducer } from "../../../reducer";
//> SNEK provider
import Provider from "../index";
//> Github provider
import GithubProvider from "../../github";
//> Gitlab provider
import GitlabProvider from "../../gitlab";
//> Instagram provider
import InstagramProvider from "../../instagram";
//> API response interfaces
import * as types from "../types";
//> Instagram util API response interfaces
import { InstagramPost, InstagramPosts } from "../../instagram/types";
//> GraphQL request data
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";
//> JSON Parser
// Contains a functions which parses json to objects.
// On error, a default value is returned.
import { safelyParseJSON } from "../../../toolbox/Parser";
//#endregion

//#region > Functions
/**
 * @function allBrief returns a brief list of all persons
 */
const allBrief = async () => {
  try {
    const res = await Provider.client.session.runner<{
      page: { children: types.GraphqlPersonPageBrief[] };
    }>("query", queries.allUserPagesBrief, {});
    return res.data ? res.data.page.children : [];
  } catch {
    throw new Error(`Couldn't successfully fetch all persons brief`);
  }
};

/**
 * @function get returns a person page
 * @param runnerOptions Name of a person
 */
const get = async (runnerOptions: { personName: string }) => {
  try {
    const res = await Provider.client.session.runner<{
      page: types.GraphQLPersonPage;
    }>("query", queries.getPerson, {
      slug: `p-${runnerOptions.personName}`,
    });
    if (res.data) {
      let person: Omit<types.GraphQLPerson, "currentStatistic"> & {
        currentStatistic: types.GraphQLPersonStatistic;
      };

      let rnt: Omit<
        types.GraphQLPersonPage,
        "movablePool" | "tids" | "bids" | "person"
      > & {
        tids: string[];
        bids: string[];
        movablePool: { [x: string]: any[] };
        person: typeof person;
      };

      const movablePool = Object.fromEntries(
        Object.entries(res.data.page.movablePool).map(([key, val]) => [
          val.field,
          safelyParseJSON<{ order: number[] }, { order: number[] }>(
            val.rawValue,
            { order: [] }
          ).order,
        ])
      );

      rnt = {
        ...res.data.page,
        person: {
          ...res.data.page.person,
          currentStatistic: res.data.page.person.currentStatistic[0],
        },
        tids: safelyParseJSON(res.data.page.tids, []),
        bids: safelyParseJSON(res.data.page.bids, []),
        movablePool: movablePool,
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

/**
 * @function register creates a new user with the given values
 * @param runnerOptions Values for the registration form
 */
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

/**
 * @function profiles returns all profiles of a person
 * @param runnerOptions Name of a person
 */
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
        isAccessTokenExpired: boolean;
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

/**
 * @function processProfiles processes each profile of a person individually
 * @param runnerOptions Name of a person
 */
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
              authorization: `Bearer ${profile.accessToken}`,
            });
            console.info("GITHUB DONE");
            break;
          case "GITLAB":
            await GitlabProvider.processSource(profile.sourceUrl, {
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
        year: statistic.year !== 0 ? statistic.year : null,
        calendarData: JSON.stringify(statistic.calendar),
        contributionTypeData: JSON.stringify(statistic.contributions),
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

  const currentStatisticForVariableStore = prepareStatisticForVariableStore(
    mergedProfiles.statistic.current
  );

  const storingInfo = {
    currentStatistic: JSON.stringify(
      currentStatisticForVariableStore ? currentStatisticForVariableStore : {}
    ),
    yearsStatistic: JSON.stringify(
      mergedProfiles.statistic.years.map((e) =>
        prepareStatisticForVariableStore(e)
      )
    ),
    languages: JSON.stringify(
      mergedProfiles.statistic.languages
        ? mergedProfiles.statistic.languages
        : ""
    ),
    organisations: JSON.stringify(
      mergedProfiles.profile?.organizations
        ? mergedProfiles.profile?.organizations
        : ""
    ),
    projects: JSON.stringify(
      mergedProfiles.profile?.repositories
        ? mergedProfiles.profile?.repositories
        : ""
    ),
  };

  writeVariableStore({
    personName: runnerOptions.personName,
    toStore: storingInfo,
  }).then((res) =>
    res
      ? console.info(
          `Successfully written variable store for Person: ${runnerOptions.personName}`
        )
      : console.warn(
          `Couldn't successfully write variable store for Person: ${runnerOptions.personName}`
        )
  );

  return storingInfo;
};

/**
 * @function addProfile adds a profile to a person
 * @param runnerOptions Name of a person and a proper source object
 */
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

/**
 * @function deleteProfile deletes a profile of a person
 * @param runnerOptions Id of a profile
 */
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

/**
 * @function updateProfile updates a profile of a person
 * @param runnerOptions Id of a profile and values to update
 */
const updateProfile = async (runnerOptions: {
  profileId: number;
  toUpdate: {
    accessToken?: string;
    sourceType?: string;
    username?: string;
    isActive?: Boolean;
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      updateProfile: {
        profile: { id: number };
      };
    }>("mutation", mutations.updateProfile, {
      profileId: runnerOptions.profileId,
      ...runnerOptions.toUpdate,
    });

    return res.data ? res.data.updateProfile.profile : null;
  } catch {
    throw new Error(
      `Couldn't successfully update profile with Id: ${runnerOptions.profileId}`
    );
  }
};

/**
 * @function writeVariableStore updates/writes the variable store of a person
 * @param runnerOptions Name of a person and values to update
 */
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
      rawCurrentStatisticCalendarImage:
        runnerOptions.toStore.currentCalendarImage,
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

/**
 * @function updateSettings updates the settings of a person
 * @param runnerOptions Name of a person and settings to update
 */
const updateSettings = async (runnerOptions: {
  personName: string;
  settings: {
    avatarImage?: File;
    bio?: string;
    display2dCalendar?: boolean;
    display3dCalendar?: boolean;
    displayContributionTypes?: boolean;
    displayWeekActivity?: boolean;
    displayImageGallery?: boolean;
    displayVideoGallery?: boolean;
    displayMusicGallery?: boolean;
    displayMap?: boolean;
    displayEmail?: boolean;
    displayProgrammingLanguages?: boolean;
    displayRanking?: boolean;
    displayWorkplace?: boolean;
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

/**
 * @function addMetaLink adds a meta link to a person
 * @param runnerOptions Name of a person and link values
 */
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

/**
 * @function deleteMetaLink deletes a meta link of a person
 * @param runnerOptions Id of a meta link
 */
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

/**
 * @function deleteMetaLink check if a meta link already exists for the given
 *           values.
 * @param runnerOptions Name of a person and values to check
 */
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

/**
 * @function getInstagramPosts generates a list of instagram posts based on the
 *           profiles of a person. The next set of posts can be generated by
 *           calling .next().
 * @param runnerOptions Name of a person
 */
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

          posts.posts.map((res) => {
            return {
              profileId: profile.id,
              ...res,
            };
          });

          return posts;
        })
    )
  ).flat();

  let rtn: {
    next: (() => Promise<InstagramPosts>)[];
    posts: InstagramPost[];
  } = { next: [], posts: [] };

  posts.forEach((e) => {
    if (e.next) {
      rtn.next.push(e.next);
    }

    rtn.posts = rtn.posts.concat(e.posts);
  });

  return rtn;
};
//#endregion

//#region > Exports
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
//#endregion
