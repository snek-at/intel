import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";

interface RunnerParameters {}

const getTalks = () => {
  try {
    return Provider.client.session
      .customTask<{
        talks: types.GraphQLTalk[];
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
        addTalk: { talk: types.GraphQLTalk };
      }>("mutation", mutations.addTalk, {
        personName: runnerOptions.personName,
        ...runnerOptions.talkOptions,
      })
      .then((res) => (res.data ? res.data.addTalk.talk : null));
  } catch {
    throw new Error(`Couldn't successfully add talk`);
  }
};

const deleteTalk = (runnerOptions: { talkId: string }) => {
  try {
    return Provider.client.session
      .customTask<{
        deleteTalk: { talks: types.GraphQLTalk[] };
      }>("mutation", mutations.deleteTalk, {
        talkId: runnerOptions.talkId,
      })
      .then((res) => (res.data ? res.data.deleteTalk.talks : []));
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
        updateTalk: { talk: types.GraphQLTalk };
      }>("mutation", mutations.updateTalk, {
        talkId: runnerOptions.talkId,
        ...runnerOptions.toUpdate,
      })
      .then((res) => (res.data ? res.data.updateTalk.talk : null));
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
        addTalkComment: { comment: types.GraphQLComment };
      }>("mutation", mutations.addTalkComment, {
        personName: runnerOptions.personName,
        ...runnerOptions.commentOptions,
      })
      .then((res) => (res.data ? res.data.addTalkComment.comment : null));
  } catch {
    throw new Error(`Couldn't successfully add comment`);
  }
};

const deleteTalkComment = (runnerOptions: { commentId: string }) => {
  try {
    return Provider.client.session
      .customTask<{
        deleteTalkComment: { comments: types.GraphQLComment };
      }>("mutation", mutations.deleteTalkComment, {
        talkId: runnerOptions.commentId,
      })
      .then((res) => (res.data ? res.data.deleteTalkComment.comments : []));
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
        updateTalkComment: { talk: types.GraphQLComment };
      }>("mutation", mutations.updateTalkComment, {
        talkId: runnerOptions.commentId,
        ...runnerOptions.toUpdate,
      })
      .then((res) => (res.data ? res.data.updateTalkComment.talk : null));
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
