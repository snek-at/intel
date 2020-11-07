//#region > Imports
//> SNEK provider
import Provider from "../index";
//> API response interfaces
import * as types from "../types";
//> GraphQL request data
import * as queries from "./queries/data";
import * as mutations from "./mutations/data";
//#endregion

//#region > Functions
/**
 * @function getTalk returns a talk
 * @param runnerOptions Id of a talk
 */
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

/**
 * @function getTalks returns all talks of a person
 * @param runnerOptions Id of a talk
 */
const getTalks = async (runnerOptions: { personName: string }) => {
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

/**
 * @function addTalk adds a new talk to a person
 * @param runnerOptions Name of a person and talk data
 */
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

/**
 * @function deleteTalk deletes a talk
 * @param runnerOptions Id of a talk
 */
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

/**
 * @function updateTalk updates the values of a talk
 * @param runnerOptions Id of a talk and talk values to update
 */
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

/**
 * @function addTalkComment adds a comment to a existing talk
 * @param runnerOptions Name of a person who adds the comment and comment values
 */
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

/**
 * @function deleteTalkComment deletes a  talk comment
 * @param runnerOptions Id of a talk and talk values to update
 */
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

/**
 * @function updateTalkComment updates the values of a talk comment
 * @param runnerOptions Id of a talk comment and talk values to update
 */
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
