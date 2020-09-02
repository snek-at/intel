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
    slug: string | null;
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
    slug: string | null;
  };
  text: string | null;
}
