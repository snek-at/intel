/**
 * Types
 */
export type MetaLinkType =
  | "INSTAGRAM"
  | "PHOTO"
  | "YOUTUBE"
  | "VIMEO"
  | "OTHER";

/**
 * All graphql response types
 */
export interface GraphQLTalk {
  id: string;
  title: string | null;
  description: string | null;
  path: string | null;
  url: string | null;
  talkComments: {
    id: string;
    createdAt: string;
    updatedAt: string;
    text: string | null;
    replies: {
      id: string | null;
    }[];
    talk: {
      id: string | null;
    };
  }[];
  owner: {
    avatarImage: {
      src: string | null;
    } | null;
    title: string | null;
    slug: string;
  };
}

export interface GraphQLComment {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: {
    avatarImage: {
      src: string | null;
    } | null;
    title: string | null;
    slug: string;
  };
  text: string | null;
}

export interface GraphQLAchievement {
  title: string;
  description: string | null;
  points: number | null;
  image: {
    src: string | null;
  } | null;
  collectors: {
    firstName: string | null;
    lastName: string | null;
    title: string | null;
    personName: string;
  }[];
}

export interface GraphQLPersonLanguages {
  color: string;
  name: string;
  size: number;
  share: number;
}

export interface GraphQLPersonStatistic {
  calendar3d: {
    src: string | null;
  } | null;
  calendar2d: string | null;
  contributionType2d: string | null;
  totalIssueContributions: number | null;
  totalCommitContributions: number | null;
  totalRepositoryContributions: number | null;
  totalPullRequestContributions: number | null;
  totalPullRequestReviewContributions: number | null;
  totalRepositoriesWithContributedIssues: number | null;
  totalRepositoriesWithContributedCommits: number | null;
  totalRepositoriesWithContributedPullRequests: number | null;
  currentStreak: {
    startDate: string;
    endDate: string;
    totalContributions: number;
    totalDays: number;
  };
  longest: {
    startDate: string;
    endDate: string;
    totalContributions: number;
    totalDays: number;
  };
}

export interface GraphQLPersonProject {
  avatarUrl: string | null;
  url: string | null;
  name: string | null;
  fullname: string | null;
  owner: {
    avatarUrl: string | null;
    url: string | null;
    name: string | null;
    fullname: string | null;
  } | null;
  members: {
    avatarUrl: string | null;
    url: string | null;
    name: string | null;
    fullname: string | null;
  }[];
  languages: GraphQLPersonLanguages[];
}

export interface GraphQLOrganisation {
  avatarUrl: string | null;
  url: string | null;
  name: string | null;
  fullname: string | null;
  description: string | null;
  members: {
    avatarUrl: string | null;
    url: string | null;
    name: string | null;
    fullname: string | null;
  }[];
  projects: GraphQLPersonProject[];
  languages: GraphQLPersonLanguages[];
}

export interface GraphQLPerson {
  currentStatistic: GraphQLPersonStatistic;
  yearsStatistic: GraphQLPersonStatistic[];
  projects: GraphQLPersonProject[];
  organisations: GraphQLOrganisation[];
  languages: GraphQLPersonLanguages[];
}

export interface GraphQLPersonPage {
  slug: string;
  title: string;
  firstName: string | null;
  lastName: string | null;
  status: string | null;
  bio: string | null;
  email: string | null;
  displayEmail: boolean;
  workplace: string | null;
  displayWorkpalce: boolean;
  websiteUrl: string | null;
  location: boolean;
  displayRanking: boolean;
  displayProgrammingLanguages: boolean;
  display2dCalendar: boolean;
  display3dCalendar: boolean;
  bids: string | null;
  tids: string | null;
  avatarImage: {
    src: string | null;
  } | null;
  metaLinks: {
    id: string;
    url: string | null;
    linkType: string | null;
    location: string | null;
    description: string | null;
    imgurDeleteHash: string | null;
  }[];
  movablePool: {
    rawValue: string | null;
    field: string;
  }[];
  person: GraphQLPerson;
  follows: GraphqlPersonPageBrief[];
  followedBy: GraphqlPersonPageBrief[];
  likes: GraphqlPersonPageBrief[];
  likedBy: GraphqlPersonPageBrief[];
  achievements: GraphQLAchievement[];
}

export interface GraphqlPersonPageBrief {
  slug: string;
  title: string;
  firstName: string | null;
  lastName: string | null;
  status: string | null;
  bio: string | null;
  avatarImage: {
    src: string | null;
  } | null;
}

export interface GraphQLRegistrationPage {
  supportedGitlabs: { id: string; organisation: string; domain: string }[];
}

export interface GraphQLMetaLink {
  id: string;
  url: string;
  linkType: MetaLinkType;
  location: string | null;
  description: string;
  imgurDeleteHash: string | null;
}
