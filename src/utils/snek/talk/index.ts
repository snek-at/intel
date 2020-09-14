import Provider from "../index";
import * as types from "../types";
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";

const getTalk = async (runnerOptions: { id: number }) => {
  try {
    const res = await Provider.client.session.runner<{
      talk: types.GraphQLTalk;
    }>("query", queries.getTalk, { ...runnerOptions });
    return res.data ? res.data.talk : null;
  } catch {
    throw new Error(
      `Couldn't successfully fetch talk with Id: ${runnerOptions.id}`
    );
  }
};

const getTalks = async (runnerOptions: { personName?: string }) => {
  try {
    const res = await Provider.client.session.runner<{
      talks: types.GraphQLTalk[];
    }>("query", queries.getTalks, { ...runnerOptions });
    return res.data ? res.data.talks : [];
  } catch {
    throw new Error(
      `Couldn't successfully fetch talks of Person: ${runnerOptions.personName}`
    );
  }
};

const addTalk = async (runnerOptions: {
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
    const res = await Provider.client.session.runner<{
      addTalk: { talk: types.GraphQLTalk };
    }>("mutation", mutations.addTalk, {
      personName: runnerOptions.personName,
      ...runnerOptions.talkOptions,
    });
    return res.data ? res.data.addTalk.talk : null;
  } catch {
    throw new Error(`Couldn't successfully add talk`);
  }
};

const deleteTalk = async (runnerOptions: { talkId: string }) => {
  try {
    const res = await Provider.client.session.runner<{
      deleteTalk: { talks: types.GraphQLTalk[] };
    }>("mutation", mutations.deleteTalk, {
      talkId: runnerOptions.talkId,
    });
    return res.data ? res.data.deleteTalk.talks : [];
  } catch {
    throw new Error(
      `Couldn't successfully delete talk with Id: ${runnerOptions.talkId}`
    );
  }
};

const updateTalk = async (runnerOptions: {
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
    const res = await Provider.client.session.runner<{
      updateTalk: { talk: types.GraphQLTalk };
    }>("mutation", mutations.updateTalk, {
      talkId: runnerOptions.talkId,
      ...runnerOptions.toUpdate,
    });
    return res.data ? res.data.updateTalk.talk : null;
  } catch {
    throw new Error(
      `Couldn't successfully update talk with Id: ${runnerOptions.talkId}`
    );
  }
};

const addTalkComment = async (runnerOptions: {
  personName: string;
  commentOptions: {
    talkId: string;
    text: string;
    replyToId?: string;
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      addTalkComment: { comment: types.GraphQLComment };
    }>("mutation", mutations.addTalkComment, {
      personName: runnerOptions.personName,
      ...runnerOptions.commentOptions,
    });
    return res.data ? res.data.addTalkComment.comment : null;
  } catch {
    throw new Error(`Couldn't successfully add comment`);
  }
};

const deleteTalkComment = async (runnerOptions: { commentId: string }) => {
  try {
    const res = await Provider.client.session.runner<{
      deleteTalkComment: { comments: types.GraphQLComment[] };
    }>("mutation", mutations.deleteTalkComment, {
      talkId: runnerOptions.commentId,
    });
    return res.data ? res.data.deleteTalkComment.comments : [];
  } catch {
    throw new Error(
      `Couldn't successfully delete comment with Id: ${runnerOptions.commentId}`
    );
  }
};

const updateTalkComment = async (runnerOptions: {
  commentId: string;
  toUpdate: {
    text?: string;
  };
}) => {
  try {
    const res = await Provider.client.session.runner<{
      updateTalkComment: { talk: types.GraphQLComment };
    }>("mutation", mutations.updateTalkComment, {
      talkId: runnerOptions.commentId,
      ...runnerOptions.toUpdate,
    });
    return res.data ? res.data.updateTalkComment.talk : null;
  } catch {
    throw new Error(
      `Couldn't successfully update comment with Id: ${runnerOptions.commentId}`
    );
  }
};

export {
  getTalk,
  getTalks,
  addTalk,
  deleteTalk,
  updateTalk,
  addTalkComment,
  deleteTalkComment,
  updateTalkComment,
};
