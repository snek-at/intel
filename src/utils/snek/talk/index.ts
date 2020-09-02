import Provider from "../index";
import * as types from "./types";
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";

interface RunnerParameters {}

const getTalks = () => {
  try {
    return Provider.client.session
      .customTask<{
        talks: {
          id: string | null;
          title: string | null;
          description: string | null;
          path: string | null;
          url: string | null;
          talkComments: {
            id: string | null;
            createdAt: string | null;
            updatedAt: string | null;
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
        }[];
      }>("query", queries.getTalks, {})
      .then((res) => (res.data ? res.data.talks : []));
  } catch {
    throw new Error(`Couldn't successfully fetch talks`);
  }
};

const getPersonTalks = (runnerOptions: { personName: string }) => {
  try {
    return Provider.client.session
      .customTask<{
        talks: types.GraphQLTalk[];
      }>("query", queries.getTalks, { personName: runnerOptions.personName })
      .then((res) => (res.data ? res.data.talks : []));
  } catch {
    throw new Error(
      `Couldn't successfully fetch talks of Person: ${runnerOptions.personName}`
    );
  }
};

const addTalk = (runnerOptions: {
  personName: string;
  talkOptions: {
    title: string;
    description?: string;
    displayUrl?: string;
    downloadUrl?: string;
    path?: string;
    url?: string;
  };
}) => {
  try {
    return Provider.client.session
      .customTask<{
        talk: types.GraphQLTalk;
      }>("mutation", mutations.addTalk, {
        personName: runnerOptions.personName,
        ...runnerOptions.talkOptions,
      })
      .then((res) => (res.data ? res.data.talk : null));
  } catch {
    throw new Error(`Couldn't successfully add talk`);
  }
};

const deleteTalk = (runnerOptions: { talkId: string }) => {
  try {
    return Provider.client.session
      .customTask<{
        talks: types.GraphQLTalk;
      }>("mutation", mutations.deleteTalk, {
        talkId: runnerOptions.talkId,
      })
      .then((res) => (res.data ? res.data.talks : []));
  } catch {
    throw new Error(
      `Couldn't successfully delete talk with Id: ${runnerOptions.talkId}`
    );
  }
};

const updateTalk = (runnerOptions: {
  talkId: string;
  toUpdate: {
    title?: string;
    description?: string;
    displayUrl?: string;
    downloadUrl?: string;
    path?: string;
    url?: string;
  };
}) => {
  try {
    return Provider.client.session
      .customTask<{
        talk: types.GraphQLTalk;
      }>("mutation", mutations.updateTalk, {
        talkId: runnerOptions.talkId,
        ...runnerOptions.toUpdate,
      })
      .then((res) => (res.data ? res.data.talk : null));
  } catch {
    throw new Error(
      `Couldn't successfully update talk with Id: ${runnerOptions.talkId}`
    );
  }
};

const addTalkComment = (runnerOptions: {
  personName: string;
  commentOptions: {
    talkId: string;
    text: string;
    replyToId?: string;
  };
}) => {
  try {
    return Provider.client.session
      .customTask<{
        comment: types.GraphQLComment;
      }>("mutation", mutations.addTalkComment, {
        personName: runnerOptions.personName,
        ...runnerOptions.commentOptions,
      })
      .then((res) => (res.data ? res.data.comment : null));
  } catch {
    throw new Error(`Couldn't successfully add comment`);
  }
};

const deleteTalkComment = (runnerOptions: { commentId: string }) => {
  try {
    return Provider.client.session
      .customTask<{
        comments: types.GraphQLComment;
      }>("mutation", mutations.deleteTalkComment, {
        talkId: runnerOptions.commentId,
      })
      .then((res) => (res.data ? res.data.comments : []));
  } catch {
    throw new Error(
      `Couldn't successfully delete comment with Id: ${runnerOptions.commentId}`
    );
  }
};

const updateTalkComment = (runnerOptions: {
  commentId: string;
  toUpdate: {
    text?: string;
  };
}) => {
  try {
    return Provider.client.session
      .customTask<{
        talk: types.GraphQLComment;
      }>("mutation", mutations.updateTalkComment, {
        talkId: runnerOptions.commentId,
        ...runnerOptions.toUpdate,
      })
      .then((res) => (res.data ? res.data.talk : null));
  } catch {
    throw new Error(
      `Couldn't successfully update comment with Id: ${runnerOptions.commentId}`
    );
  }
};

export {
  getTalks,
  getPersonTalks,
  addTalk,
  deleteTalk,
  updateTalk,
  addTalkComment,
  deleteTalkComment,
  updateTalkComment,
};
